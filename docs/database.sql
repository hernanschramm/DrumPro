-- ============================================================
-- DrumPro Academy - Modelo de Datos Completo
-- Base de datos: Supabase (PostgreSQL)
-- ============================================================
-- Notas:
-- - Todos los IDs son UUID generados automáticamente.
-- - Las fechas usan TIMESTAMPTZ (con zona horaria).
-- - created_at y updated_at se manejan con triggers.
-- - RLS (Row Level Security) está activado en todas las tablas.
-- ============================================================

-- ============================================================
-- EXTENSIONES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TIPOS ENUM
-- ============================================================

-- Rol del usuario en la plataforma
CREATE TYPE user_role AS ENUM ('admin', 'profesor', 'alumno');

-- Estado de una clase
CREATE TYPE class_status AS ENUM ('programada', 'en_curso', 'finalizada', 'cancelada');

-- Estado de una tarea/entrega
CREATE TYPE task_status AS ENUM ('pendiente', 'entregada', 'en_revision', 'aprobada', 'con_correcciones', 'vencida');

-- Estado del procesamiento de audio
CREATE TYPE processing_status AS ENUM ('pendiente', 'procesando', 'completado', 'error');

-- Nivel de dificultad
CREATE TYPE difficulty_level AS ENUM ('basico', 'intermedio', 'avanzado');

-- ============================================================
-- TABLA: profiles (extiende auth.users de Supabase)
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'alumno',
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    -- Solo alumnos tienen profesor_asignado
    profesor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    -- Solo profesores pueden tener alumnos
    is_active BOOLEAN NOT NULL DEFAULT true,
    -- Metadatos
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_role_profesor CHECK (
        role != 'alumno' OR profesor_id IS NOT NULL OR role = 'admin'
    )
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_profesor ON profiles(profesor_id) WHERE role = 'alumno';

-- ============================================================
-- TABLA: clases
-- ============================================================
CREATE TABLE clases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profesor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    alumno_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha_inicio TIMESTAMPTZ NOT NULL,
    fecha_fin TIMESTAMPTZ NOT NULL,
    estado class_status NOT NULL DEFAULT 'programada',
    -- Enlace de videollamada (Jitsi, Meet, Zoom, etc.)
    videollamada_url TEXT,
    -- Notas post-clase del profesor
    notas_profesor TEXT,
    -- Materiales adjuntos (array de URLs de Storage)
    materiales TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_fechas CHECK (fecha_fin > fecha_inicio)
);

CREATE INDEX idx_clases_profesor ON clases(profesor_id);
CREATE INDEX idx_clases_alumno ON clases(alumno_id);
CREATE INDEX idx_clases_fecha ON clases(fecha_inicio);

-- ============================================================
-- TABLA: tareas
-- ============================================================
CREATE TABLE tareas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profesor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    consigna TEXT NOT NULL,
    -- Material de apoyo (PDFs, audios, videos, enlaces)
    material_urls TEXT[] DEFAULT '{}',
    -- Fecha límite de entrega
    fecha_limite TIMESTAMPTZ NOT NULL,
    -- Puntaje máximo posible
    puntaje_maximo INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tareas_profesor ON tareas(profesor_id);

-- ============================================================
-- TABLA: tarea_asignaciones (relación N:N entre tareas y alumnos)
-- ============================================================
CREATE TABLE tarea_asignaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tarea_id UUID NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
    alumno_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    estado task_status NOT NULL DEFAULT 'pendiente',
    -- Fecha de entrega real
    fecha_entrega TIMESTAMPTZ,
    -- Calificación
    puntaje INTEGER CHECK (puntaje >= 0),
    -- Corrección del profesor (texto)
    correccion_texto TEXT,
    -- Correcciones en audio/video (URLs de Storage)
    correccion_media_urls TEXT[] DEFAULT '{}',
    -- Feedback general
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tarea_alumno UNIQUE (tarea_id, alumno_id)
);

CREATE INDEX idx_asignaciones_alumno ON tarea_asignaciones(alumno_id);
CREATE INDEX idx_asignaciones_tarea ON tarea_asignaciones(tarea_id);
CREATE INDEX idx_asignaciones_estado ON tarea_asignaciones(estado);

-- ============================================================
-- TABLA: entregas (archivos subidos por el alumno)
-- ============================================================
CREATE TABLE entregas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asignacion_id UUID NOT NULL REFERENCES tarea_asignaciones(id) ON DELETE CASCADE,
    alumno_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    -- Tipo de archivo
    tipo TEXT NOT NULL CHECK (tipo IN ('video', 'audio', 'imagen', 'otro')),
    -- URL en Supabase Storage
    archivo_url TEXT NOT NULL,
    -- Duración en segundos (para video/audio)
    duracion_segundos INTEGER,
    -- Tamaño en bytes
    tamano_bytes BIGINT,
    -- Nota del alumno al entregar
    nota_alumno TEXT,
    -- Intento número (permite re-entregas)
    intento INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_entregas_asignacion ON entregas(asignacion_id);
CREATE INDEX idx_entregas_alumno ON entregas(alumno_id);

-- ============================================================
-- TABLA: evaluaciones (evaluaciones periódicas)
-- ============================================================
CREATE TABLE evaluaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profesor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    alumno_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha_evaluacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Puntaje total
    puntaje_total INTEGER NOT NULL DEFAULT 100,
    puntaje_obtenido INTEGER,
    -- Observaciones generales
    observaciones TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evaluaciones_alumno ON evaluaciones(alumno_id);
CREATE INDEX idx_evaluaciones_profesor ON evaluaciones(profesor_id);

-- ============================================================
-- TABLA: criterios_evaluacion
-- ============================================================
CREATE TABLE criterios_evaluacion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluacion_id UUID NOT NULL REFERENCES evaluaciones(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL, -- "Tiempo", "Limpieza", "Dinámica", etc.
    puntaje_maximo INTEGER NOT NULL DEFAULT 20,
    puntaje_obtenido INTEGER,
    comentario TEXT,
    orden INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_criterios_evaluacion ON criterios_evaluacion(evaluacion_id);

-- ============================================================
-- TABLA: sesiones_practica (registro de tiempo de práctica)
-- ============================================================
CREATE TABLE sesiones_practica (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumno_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    minutos INTEGER NOT NULL DEFAULT 0,
    -- Qué practicó (rudimentos, grooves, canciones)
    contenido TEXT,
    -- BPM alcanzado (opcional)
    bpm_alcanzado INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sesiones_alumno ON sesiones_practica(alumno_id);
CREATE INDEX idx_sesiones_fecha ON sesiones_practica(fecha);

-- ============================================================
-- TABLA: rudimentos (catálogo de los 40 rudimentos PAS)
-- ============================================================
CREATE TABLE rudimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL, -- "Rolls", "Drum Solos", "Hybrid Rudiments", etc.
    notacion TEXT, -- Notación musical (texto o URL de imagen)
    video_url TEXT, -- Video demostrativo
    descripcion TEXT,
    bpm_objetivo INTEGER,
    dificultad difficulty_level NOT NULL DEFAULT 'basico',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: grooves (catálogo de grooves y ritmos)
-- ============================================================
CREATE TABLE grooves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    estilo TEXT NOT NULL, -- "rock", "funk", "jazz", "latino", etc.
    dificultad difficulty_level NOT NULL DEFAULT 'basico',
    compas TEXT NOT NULL DEFAULT '4/4',
    -- Patrón en formato JSON (grilla de 16 pasos por instrumento)
    patron JSONB NOT NULL,
    bpm_sugerido INTEGER DEFAULT 100,
    descripcion TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_grooves_estilo ON grooves(estilo);
CREATE INDEX idx_grooves_dificultad ON grooves(dificultad);

-- ============================================================
-- TABLA: progreso_rudimentos (dominio del alumno)
-- ============================================================
CREATE TABLE progreso_rudimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumno_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rudimento_id UUID NOT NULL REFERENCES rudimentos(id) ON DELETE CASCADE,
    dominado BOOLEAN NOT NULL DEFAULT false,
    -- Validación del profesor
    validado_por UUID REFERENCES profiles(id),
    bpm_actual INTEGER,
    notas TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_alumno_rudimento UNIQUE (alumno_id, rudimento_id)
);

-- ============================================================
-- TABLA: progreso_grooves (dominio del alumno)
-- ============================================================
CREATE TABLE progreso_grooves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumno_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    groove_id UUID NOT NULL REFERENCES grooves(id) ON DELETE CASCADE,
    dominado BOOLEAN NOT NULL DEFAULT false,
    validado_por UUID REFERENCES profiles(id),
    bpm_actual INTEGER,
    notas TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_alumno_groove UNIQUE (alumno_id, groove_id)
);

-- ============================================================
-- TABLA: canciones_material (material de estudio con canciones)
-- ============================================================
CREATE TABLE canciones_material (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Puede ser creado por profesor o admin
    creado_por UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    artista TEXT,
    -- Enlaces externos (Spotify, YouTube) - solo para escuchar
    spotify_url TEXT,
    youtube_url TEXT,
    -- Archivos subidos propios (MP3/WAV con licencia)
    archivo_audio_url TEXT,
    -- BPM detectado automáticamente
    bpm_detectado INTEGER,
    -- Mapa de tempo (JSON: array de {beat, time, bpm})
    mapa_tempo JSONB,
    -- Estado del procesamiento de stems
    stems_status processing_status DEFAULT 'pendiente',
    -- URLs de los stems separados (bateria, bajo, guitarra, voz, otros)
    stems_urls JSONB,
    -- Marcadores de secciones (JSON: array de {nombre, inicio, fin})
    secciones JSONB DEFAULT '[]',
    -- Aviso legal aceptado
    aviso_legal_aceptado BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_canciones_creador ON canciones_material(creado_por);
CREATE INDEX idx_canciones_stems_status ON canciones_material(stems_status);

-- ============================================================
-- TABLA: cola_procesamiento (trabajos de audio pendientes)
-- ============================================================
CREATE TABLE cola_procesamiento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cancion_id UUID NOT NULL REFERENCES canciones_material(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('bpm_detection', 'stems_separation', 'note_detection')),
    estado processing_status NOT NULL DEFAULT 'pendiente',
    -- Progreso 0-100
    progreso INTEGER NOT NULL DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
    -- Resultado (JSON con los datos procesados)
    resultado JSONB,
    -- Mensaje de error si falla
    error_mensaje TEXT,
    -- Intentos
    intentos INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cola_estado ON cola_procesamiento(estado);

-- ============================================================
-- TABLA: notificaciones
-- ============================================================
CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'info', -- info, clase, tarea, evaluacion
    -- Datos adicionales (JSON)
    datos JSONB DEFAULT '{}',
    leida BOOLEAN NOT NULL DEFAULT false,
    -- Token de dispositivo para push
    dispositivo_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida) WHERE leida = false;

-- ============================================================
-- TABLA: racha_estudio (para gamificación)
-- ============================================================
CREATE TABLE rachas_estudio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumno_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL,
    fecha_ultimo_dia DATE NOT NULL,
    dias_consecutivos INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT uq_alumno_racha UNIQUE (alumno_id, fecha_inicio)
);

-- ============================================================
-- TRIGGERS: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas con updated_at
CREATE TRIGGER trigger_profiles_updated BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_clases_updated BEFORE UPDATE ON clases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_tareas_updated BEFORE UPDATE ON tareas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_asignaciones_updated BEFORE UPDATE ON tarea_asignaciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_evaluaciones_updated BEFORE UPDATE ON evaluaciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_canciones_updated BEFORE UPDATE ON canciones_material
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_cola_updated BEFORE UPDATE ON cola_procesamiento
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: crear profile automáticamente al registrarse
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Sin nombre'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'alumno')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - POLÍTICAS
-- ============================================================

-- Activar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarea_asignaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE criterios_evaluacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_practica ENABLE ROW LEVEL SECURITY;
ALTER TABLE rudimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grooves ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso_rudimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso_grooves ENABLE ROW LEVEL SECURITY;
ALTER TABLE canciones_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE cola_procesamiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE rachas_estudio ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FUNCIÓN AUXILIAR: verificar si es admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCIÓN AUXILIAR: verificar si es profesor del alumno
-- ============================================================
CREATE OR REPLACE FUNCTION is_profesor_of(alumno_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'profesor'
        AND id IN (
            SELECT profesor_id FROM profiles WHERE id = alumno_uuid
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- POLÍTICAS: profiles
-- ============================================================

-- Admin: ve y modifica todos los perfiles
CREATE POLICY "admin_ve_todos_perfiles" ON profiles
    FOR SELECT USING (is_admin());

CREATE POLICY "admin_modifica_todos_perfiles" ON profiles
    FOR ALL USING (is_admin());

-- Profesor: ve su propio perfil y el de sus alumnos
CREATE POLICY "profesor_ve_sus_alumnos" ON profiles
    FOR SELECT USING (
        id = auth.uid()
        OR (
            EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'profesor')
            AND profesor_id = auth.uid()
        )
    );

-- Profesor puede actualizar solo su propio perfil
CREATE POLICY "profesor_actualiza_propio" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- Alumno: ve su propio perfil y el de su profesor
CREATE POLICY "alumno_ve_propio_y_profesor" ON profiles
    FOR SELECT USING (
        id = auth.uid()
        OR id IN (SELECT profesor_id FROM profiles WHERE id = auth.uid())
    );

-- Alumno puede actualizar solo su propio perfil
CREATE POLICY "alumno_actualiza_propio" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- ============================================================
-- POLÍTICAS: clases
-- ============================================================

-- Admin: acceso total
CREATE POLICY "admin_acceso_clases" ON clases
    FOR ALL USING (is_admin());

-- Profesor: ve, crea y modifica clases de sus alumnos
CREATE POLICY "profesor_acceso_clases" ON clases
    FOR ALL USING (
        profesor_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = alumno_id AND p.profesor_id = auth.uid()
        )
    );

-- Alumno: ve solo sus propias clases
CREATE POLICY "alumno_ve_sus_clases" ON clases
    FOR SELECT USING (alumno_id = auth.uid());

-- ============================================================
-- POLÍTICAS: tareas
-- ============================================================

CREATE POLICY "admin_acceso_tareas" ON tareas
    FOR ALL USING (is_admin());

-- Profesor: gestiona sus propias tareas
CREATE POLICY "profesor_acceso_tareas" ON tareas
    FOR ALL USING (profesor_id = auth.uid());

-- Alumno: ve tareas asignadas a él
CREATE POLICY "alumno_ve_tareas_asignadas" ON tareas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tarea_asignaciones ta
            WHERE ta.tarea_id = tareas.id AND ta.alumno_id = auth.uid()
        )
    );

-- ============================================================
-- POLÍTICAS: tarea_asignaciones
-- ============================================================

CREATE POLICY "admin_acceso_asignaciones" ON tarea_asignaciones
    FOR ALL USING (is_admin());

-- Profesor: gestiona asignaciones de sus alumnos
CREATE POLICY "profesor_acceso_asignaciones" ON tarea_asignaciones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tareas t
            WHERE t.id = tarea_id AND t.profesor_id = auth.uid()
        )
    );

-- Alumno: ve y actualiza sus propias asignaciones
CREATE POLICY "alumno_acceso_asignaciones" ON tarea_asignaciones
    FOR SELECT USING (alumno_id = auth.uid());

CREATE POLICY "alumno_actualiza_entrega" ON tarea_asignaciones
    FOR UPDATE USING (
        alumno_id = auth.uid()
        AND estado IN ('pendiente', 'con_correcciones')
    );

-- ============================================================
-- POLÍTICAS: entregas
-- ============================================================

CREATE POLICY "admin_acceso_entregas" ON entregas
    FOR ALL USING (is_admin());

-- Profesor: ve entregas de sus alumnos
CREATE POLICY "profesor_ve_entregas" ON entregas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tarea_asignaciones ta
            JOIN tareas t ON t.id = ta.tarea_id
            WHERE ta.id = asignacion_id
            AND t.profesor_id = auth.uid()
        )
    );

-- Alumno: crea y ve sus propias entregas
CREATE POLICY "alumno_acceso_entregas" ON entregas
    FOR ALL USING (alumno_id = auth.uid());

-- ============================================================
-- POLÍTICAS: evaluaciones
-- ============================================================

CREATE POLICY "admin_acceso_evaluaciones" ON evaluaciones
    FOR ALL USING (is_admin());

CREATE POLICY "profesor_acceso_evaluaciones" ON evaluaciones
    FOR ALL USING (
        profesor_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = alumno_id AND p.profesor_id = auth.uid()
        )
    );

CREATE POLICY "alumno_ve_sus_evaluaciones" ON evaluaciones
    FOR SELECT USING (alumno_id = auth.uid());

-- ============================================================
-- POLÍTICAS: criterios_evaluacion (hereda de evaluaciones)
-- ============================================================

CREATE POLICY "admin_acceso_criterios" ON criterios_evaluacion
    FOR ALL USING (is_admin());

CREATE POLICY "profesor_acceso_criterios" ON criterios_evaluacion
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM evaluaciones e
            WHERE e.id = evaluacion_id AND e.profesor_id = auth.uid()
        )
    );

CREATE POLICY "alumno_ve_criterios" ON criterios_evaluacion
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM evaluaciones e
            WHERE e.id = evaluacion_id AND e.alumno_id = auth.uid()
        )
    );

-- ============================================================
-- POLÍTICAS: sesiones_practica
-- ============================================================

CREATE POLICY "admin_acceso_sesiones" ON sesiones_practica
    FOR ALL USING (is_admin());

CREATE POLICY "profesor_ve_sesiones_alumnos" ON sesiones_practica
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = alumno_id AND p.profesor_id = auth.uid()
        )
    );

CREATE POLICY "alumno_acceso_sesiones" ON sesiones_practica
    FOR ALL USING (alumno_id = auth.uid());

-- ============================================================
-- POLÍTICAS: rudimentos y grooves (catálogo público)
-- ============================================================

-- Todos los usuarios autenticados pueden leer el catálogo
CREATE POLICY "todos_ven_rudimentos" ON rudimentos
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_gestiona_rudimentos" ON rudimentos
    FOR ALL USING (is_admin());

CREATE POLICY "todos_ven_grooves" ON grooves
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_gestiona_grooves" ON grooves
    FOR ALL USING (is_admin());

-- ============================================================
-- POLÍTICAS: progreso_rudimentos y progreso_grooves
-- ============================================================

CREATE POLICY "admin_acceso_progreso_rud" ON progreso_rudimentos
    FOR ALL USING (is_admin());

CREATE POLICY "profesor_acceso_progreso_rud" ON progreso_rudimentos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = alumno_id AND p.profesor_id = auth.uid()
        )
    );

CREATE POLICY "alumno_acceso_progreso_rud" ON progreso_rudimentos
    FOR ALL USING (alumno_id = auth.uid());

CREATE POLICY "admin_acceso_progreso_grooves" ON progreso_grooves
    FOR ALL USING (is_admin());

CREATE POLICY "profesor_acceso_progreso_grooves" ON progreso_grooves
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = alumno_id AND p.profesor_id = auth.uid()
        )
    );

CREATE POLICY "alumno_acceso_progreso_grooves" ON progreso_grooves
    FOR ALL USING (alumno_id = auth.uid());

-- ============================================================
-- POLÍTICAS: canciones_material
-- ============================================================

CREATE POLICY "admin_acceso_canciones" ON canciones_material
    FOR ALL USING (is_admin());

-- Profesor: ve y crea canciones para sus alumnos
CREATE POLICY "profesor_acceso_canciones" ON canciones_material
    FOR ALL USING (
        creado_por = auth.uid()
        OR EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.profesor_id = auth.uid()
        )
    );

-- Alumno: ve canciones creadas por su profesor
CREATE POLICY "alumno_ve_canciones_profesor" ON canciones_material
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.profesor_id = canciones_material.creado_por
        )
    );

-- ============================================================
-- POLÍTICAS: cola_procesamiento
-- ============================================================

CREATE POLICY "admin_acceso_cola" ON cola_procesamiento
    FOR ALL USING (is_admin());

-- Profesor y alumno ven el estado de sus canciones
CREATE POLICY "usuarios_ven_su_cola" ON cola_procesamiento
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM canciones_material c
            WHERE c.id = cancion_id
            AND (c.creado_por = auth.uid() OR EXISTS (
                SELECT 1 FROM profiles p
                WHERE p.id = auth.uid() AND p.profesor_id = c.creado_por
            ))
        )
    );

-- ============================================================
-- POLÍTICAS: notificaciones
-- ============================================================

CREATE POLICY "usuario_ve_sus_notificaciones" ON notificaciones
    FOR ALL USING (usuario_id = auth.uid());

-- ============================================================
-- POLÍTICAS: rachas_estudio
-- ============================================================

CREATE POLICY "admin_acceso_rachas" ON rachas_estudio
    FOR ALL USING (is_admin());

CREATE POLICY "profesor_ve_rachas_alumnos" ON rachas_estudio
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = alumno_id AND p.profesor_id = auth.uid()
        )
    );

CREATE POLICY "alumno_acceso_rachas" ON rachas_estudio
    FOR ALL USING (alumno_id = auth.uid());

-- ============================================================
-- STORAGE BUCKETS (Supabase Storage)
-- ============================================================
-- Estos se crean desde el dashboard de Supabase o con SQL:

INSERT INTO storage.buckets (id, name, public) VALUES
    ('avatars', 'avatars', true),
    ('entregas', 'entregas', false),
    ('materiales', 'materiales', false),
    ('audio-stems', 'audio-stems', false),
    ('correcciones', 'correcciones', false);

-- Políticas de Storage
-- Avatares: público para lectura
CREATE POLICY "avatars_publicos" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "usuarios_suben_avatares" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Entregas: solo el alumno y su profesor
CREATE POLICY "entregas_lectura" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'entregas'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR is_admin()
        )
    );

CREATE POLICY "entregas_escritura" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'entregas' AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ============================================================
-- VIEWS ÚTILES
-- ============================================================

-- Vista: resumen de alumnos para el profesor
CREATE VIEW v_alumnos_profesor AS
SELECT
    p.id,
    p.full_name,
    p.email,
    p.avatar_url,
    COUNT(DISTINCT ta.id) AS tareas_pendientes,
    COALESCE(SUM(sp.minutos), 0) AS total_minutos_practica,
    MAX(sp.fecha) AS ultima_practica
FROM profiles p
LEFT JOIN tarea_asignaciones ta ON ta.alumno_id = p.id AND ta.estado = 'pendiente'
LEFT JOIN sesiones_practica sp ON sp.alumno_id = p.id
WHERE p.role = 'alumno'
GROUP BY p.id, p.full_name, p.email, p.avatar_url;

-- Vista: progreso general del alumno
CREATE VIEW v_progreso_alumno AS
SELECT
    p.id AS alumno_id,
    p.full_name,
    COUNT(DISTINCT ta.id) AS tareas_completadas,
    AVG(ta.puntaje::float) AS promedio_notas,
    COALESCE(SUM(sp.minutos), 0) AS total_minutos,
    COUNT(DISTINCT pr.id) AS rudimentos_dominados,
    COUNT(DISTINCT pg.id) AS grooves_dominados
FROM profiles p
LEFT JOIN tarea_asignaciones ta ON ta.alumno_id = p.id AND ta.estado = 'aprobada'
LEFT JOIN sesiones_practica sp ON sp.alumno_id = p.id
LEFT JOIN progreso_rudimentos pr ON pr.alumno_id = p.id AND pr.dominado = true
LEFT JOIN progreso_grooves pg ON pg.alumno_id = p.id AND pg.dominado = true
WHERE p.role = 'alumno'
GROUP BY p.id, p.full_name;

-- ============================================================
-- DATOS INICIALES (seed)
-- ============================================================

-- Insertar los 40 rudimentos PAS (ejemplo con los primeros 10)
INSERT INTO rudimentos (nombre, categoria, dificultad, descripcion) VALUES
    ('Single Stroke Roll', 'Rolls', 'basico', 'Alternancia simple de manos: RLRL'),
    ('Double Stroke Roll', 'Rolls', 'basico', 'Dobles alternados: RRLL'),
    ('Single Paradiddle', 'Rolls', 'basico', 'RLRR LRLL'),
    ('Double Paradiddle', 'Rolls', 'intermedio', 'RLRL RR LLRL RR'),
    ('Triple Paradiddle', 'Rolls', 'intermedio', 'RLRLRL RR LLRLRL'),
    ('Paradiddle-diddle', 'Rolls', 'intermedio', 'RLRRLL RLRRLL'),
    ('Five Stroke Roll', 'Rolls', 'intermedio', 'RLRLR LRLRL (cerrado)'),
    ('Six Stroke Roll', 'Rolls', 'intermedio', 'RLRRLL LRLLRR'),
    ('Seven Stroke Roll', 'Rolls', 'avanzado', 'RLRLRLR LRLRLRL (cerrado)'),
    ('Nine Stroke Roll', 'Rolls', 'avanzado', 'RLRLRLRLR cerrado'),
    ('Long Roll', 'Rolls', 'avanzado', 'Tresilllos dobles continuos'),
    ('Flam', 'Drum Solos', 'basico', 'Nota de gracia + nota principal'),
    ('Flam Accent', 'Drum Solos', 'basico', 'Flam en tiempo fuerte'),
    ('Flam Tap', 'Drum Solos', 'intermedio', 'Flams alternados'),
    ('Drag Tap', 'Drum Solos', 'intermedio', 'Dos notas de gracia + principal'),
    ('Single Drag Tap', 'Drum Solos', 'intermedio', 'Variación del drag'),
    ('Double Drag Tap', 'Drum Solos', 'intermedio', 'Dos drags + tap'),
    ('Lesson 25', 'Drum Solos', 'avanzado', 'Combinación de drags'),
    ('Single Drag', 'Drum Solos', 'basico', 'Un drag simple'),
    ('Open Flam', 'Drum Solos', 'intermedio', 'Flam con ambas manos simultáneas'),
    ('Pataflafla', 'Hybrid Rudiments', 'intermedio', 'Flam + dos golpes + flam'),
    ('Swiss Army Triplet', 'Hybrid Rudiments', 'avanzado', 'Flam + tresillo + acento'),
    ('Inverted Flam Tap', 'Hybrid Rudiments', 'avanzado', 'Flam tap invertido'),
    ('Flam Drag', 'Hybrid Rudiments', 'intermedio', 'Flam + drag'),
    ('Cheese', 'Hybrid Rudiments', 'avanzado', 'Combinación híbrida'),
    ('Flamacue', 'Hybrid Rudiments', 'avanzado', 'Flam + paradiddle'),
    ('Flam Paradiddle', 'Hybrid Rudiments', 'avanzado', 'Flam + paradiddle'),
    ('Single Flammed Mill', 'Hybrid Rudiments', 'avanzado', 'Flams continuos'),
    ('Triple Rat', 'Hybrid Rudiments', 'avanzado', 'Combinación compleja'),
    ('Windmill', 'Hybrid Rudiments', 'avanzado', 'Patrón circular'),
    ('Cocoa', 'Hybrid Rudiments', 'avanzado', 'Rudimento híbrido'),
    ('Ringy', 'Hybrid Rudiments', 'avanzado', 'Combinación avanzada'),
    ('Johnnny', 'Hybrid Rudiments', 'avanzado', 'Rudimento moderno'),
    ('Crazy Legs', 'Hybrid Rudiments', 'avanzado', 'Técnica de pie'),
    ('Hybrid', 'Hybrid Rudiments', 'avanzado', 'Combinación libre'),
    ('Fife', 'Hybrid Rudiments', 'avanzado', 'Estilo militar'),
    ('Camp Duty', 'Hybrid Rudiments', 'avanzado', 'Patrón militar'),
    ('Strip Mining', 'Hybrid Rudiments', 'avanzado', 'Técnica avanzada'),
    ('Boscoe', 'Hybrid Rudiments', 'avanzado', 'Rudimento contemporáneo'),
    ('Dom Perignon', 'Hybrid Rudiments', 'avanzado', 'Rudimento moderno');

-- Insertar grooves de ejemplo
INSERT INTO grooves (nombre, estilo, dificultad, compas, patron, descripcion) VALUES
    ('Rock Básico', 'rock', 'basico', '4/4',
     '{"kick":[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],"snare":[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],"hihat":[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]}',
     'El groove de rock más básico. Bombo en 1 y 3, caja en 2 y 4, hi-hat en corcheas.'),
    ('Funk Básico', 'funk', 'basico', '4/4',
     '{"kick":[1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0],"snare":[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],"hihat":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}',
     'Groove funk con bombo sincopado y hi-hat en semicorcheas.'),
    ('Shuffle', 'blues', 'intermedio', '4/4',
     '{"kick":[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],"snare":[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],"hihat":[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1]}',
     'Shuffle clásico con feel de tresillo.'),
    ('Jazz Ride', 'jazz', 'intermedio', '4/4',
     '{"ride":[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],"hihat":[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]}',
     'Patrón de ride jazz con hi-hat en 2 y 4.'),
    ('Reggaeton', 'latino', 'basico', '4/4',
     '{"kick":[1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0],"snare":[0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0],"hihat":[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]}',
     'Dembow básico: el ritmo fundamental del reggaeton.'),
    ('Metal Blast Beat', 'metal', 'avanzado', '4/4',
     '{"kick":[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],"snare":[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],"hihat":[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]}',
     'Blast beat: bombo, caja y hi-hat a la vez en semicorcheas.');
