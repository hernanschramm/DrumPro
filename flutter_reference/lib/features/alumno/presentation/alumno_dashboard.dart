// ============================================================
// DrumPro Academy - Dashboard de Alumno (referencia)
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/constants/app_strings.dart';
import '../../auth/presentation/auth_provider.dart';

/// Dashboard principal del alumno
/// Muestra tareas, clases, biblioteca y progreso
class AlumnoDashboard extends ConsumerWidget {
  const AlumnoDashboard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;

    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('🎵 Mi Panel'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Tareas'),
              Tab(text: 'Clases'),
              Tab(text: 'Biblioteca'),
              Tab(text: 'Progreso'),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.logout),
              onPressed: () => ref.read(authStateProvider.notifier).signOut(),
            ),
          ],
        ),
        body: TabBarView(
          children: [
            _TasksTab(alumnoId: user!.id),
            _ClassesTab(alumnoId: user.id),
            const _LibraryTab(),
            _ProgressTab(alumnoId: user.id),
          ],
        ),
      ),
    );
  }
}

/// Pestaña de tareas del alumno
class _TasksTab extends StatelessWidget {
  final String alumnoId;
  const _TasksTab({required this.alumnoId});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: Supabase.instance.client
          .from('tarea_asignaciones')
          .select('*, tareas(*)')
          .eq('alumno_id', alumnoId)
          .order('created_at', ascending: false),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        
        final assignments = snapshot.data as List? ?? [];
        
        if (assignments.isEmpty) {
          return const Center(child: Text('No tienes tareas asignadas'));
        }
        
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: assignments.length,
          itemBuilder: (context, index) {
            final assignment = assignments[index];
            final task = assignment['tareas'];
            
            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                title: Text(task['titulo']),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(task['consigna'], maxLines: 2, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Text(
                      'Fecha límite: ${DateTime.parse(task['fecha_limite']).toLocal().toString().split(' ')[0]}',
                      style: const TextStyle(fontSize: 12),
                    ),
                  ],
                ),
                trailing: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: assignment['estado'] == 'pendiente'
                        ? Colors.yellow.shade100
                        : assignment['estado'] == 'aprobada'
                            ? Colors.green.shade100
                            : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    assignment['estado'],
                    style: const TextStyle(fontSize: 12),
                  ),
                ),
                onTap: () {
                  // Navegar a detalle de tarea
                },
              ),
            );
          },
        );
      },
    );
  }
}

/// Pestaña de clases del alumno
class _ClassesTab extends StatelessWidget {
  final String alumnoId;
  const _ClassesTab({required this.alumnoId});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Próximas clases (implementar)'),
    );
  }
}

/// Pestaña de biblioteca
class _LibraryTab extends StatelessWidget {
  const _LibraryTab();

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Column(
        children: [
          const TabBar(
            tabs: [
              Tab(text: 'Rudimentos'),
              Tab(text: 'Grooves'),
            ],
          ),
          Expanded(
            child: TabBarView(
              children: [
                _RudimentsList(),
                _GroovesList(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Lista de rudimentos
class _RudimentsList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: Supabase.instance.client.from('rudimentos').select(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        
        final rudiments = snapshot.data as List? ?? [];
        
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: rudiments.length,
          itemBuilder: (context, index) {
            final rudiment = rudiments[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                title: Text(rudiment['nombre']),
                subtitle: Text(rudiment['descripcion'] ?? ''),
                trailing: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: rudiment['dificultad'] == 'basico'
                        ? Colors.green.shade100
                        : rudiment['dificultad'] == 'intermedio'
                            ? Colors.yellow.shade100
                            : Colors.red.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    rudiment['dificultad'],
                    style: const TextStyle(fontSize: 12),
                  ),
                ),
                onTap: () {
                  // Navegar a detalle del rudimento
                },
              ),
            );
          },
        );
      },
    );
  }
}

/// Lista de grooves
class _GroovesList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: Supabase.instance.client.from('grooves').select(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        
        final grooves = snapshot.data as List? ?? [];
        
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: grooves.length,
          itemBuilder: (context, index) {
            final groove = grooves[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                title: Text(groove['nombre']),
                subtitle: Text('${groove['estilo']} • ${groove['compas']}'),
                trailing: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: groove['dificultad'] == 'basico'
                        ? Colors.green.shade100
                        : groove['dificultad'] == 'intermedio'
                            ? Colors.yellow.shade100
                            : Colors.red.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    groove['dificultad'],
                    style: const TextStyle(fontSize: 12),
                  ),
                ),
                onTap: () {
                  // Navegar a detalle del groove
                },
              ),
            );
          },
        );
      },
    );
  }
}

/// Pestaña de progreso
class _ProgressTab extends StatelessWidget {
  final String alumnoId;
  const _ProgressTab({required this.alumnoId});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildStatCard('Tareas completadas', '0', Icons.check_circle),
          const SizedBox(height: 12),
          _buildStatCard('Minutos de práctica', '0', Icons.timer),
          const SizedBox(height: 12),
          _buildStatCard('Rudimentos dominados', '0', Icons.music_note),
          const SizedBox(height: 12),
          _buildStatCard('Racha de estudio', '0 días', Icons.local_fire_department),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(icon, size: 48, color: Colors.green),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
