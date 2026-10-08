// ============================================================
// DrumPro Academy - Dashboard de Profesor (referencia)
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_strings.dart';
import '../../auth/presentation/auth_provider.dart';

/// Dashboard principal del profesor
/// Muestra sus alumnos, clases y tareas
class ProfesorDashboard extends ConsumerWidget {
  const ProfesorDashboard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('🎓 Panel de Profesor'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Alumnos'),
              Tab(text: 'Clases'),
              Tab(text: 'Tareas'),
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
            _StudentsTab(profesorId: user!.id),
            _ClassesTab(profesorId: user.id),
            _TasksTab(profesorId: user.id),
          ],
        ),
      ),
    );
  }
}

/// Pestaña de alumnos del profesor
class _StudentsTab extends StatelessWidget {
  final String profesorId;
  const _StudentsTab({required this.profesorId});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: Supabase.instance.client
          .from('profiles')
          .select()
          .eq('profesor_id', profesorId)
          .eq('role', 'alumno'),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        
        final students = snapshot.data as List? ?? [];
        
        if (students.isEmpty) {
          return const Center(child: Text('No tienes alumnos asignados'));
        }
        
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: students.length,
          itemBuilder: (context, index) {
            final student = students[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.green,
                  child: Text(student['full_name'][0]),
                ),
                title: Text(student['full_name']),
                subtitle: Text(student['email']),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  // Navegar a detalle del alumno
                },
              ),
            );
          },
        );
      },
    );
  }
}

/// Pestaña de clases del profesor
class _ClassesTab extends StatelessWidget {
  final String profesorId;
  const _ClassesTab({required this.profesorId});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.calendar_today, size: 64, color: Colors.grey),
          const SizedBox(height: 16),
          const Text('Calendario de clases'),
          const SizedBox(height: 8),
          ElevatedButton.icon(
            onPressed: () {
              // Crear nueva clase
            },
            icon: const Icon(Icons.add),
            label: const Text('Programar Clase'),
          ),
        ],
      ),
    );
  }
}

/// Pestaña de tareas del profesor
class _TasksTab extends StatelessWidget {
  final String profesorId;
  const _TasksTab({required this.profesorId});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.assignment, size: 64, color: Colors.grey),
          const SizedBox(height: 16),
          const Text('Gestión de tareas'),
          const SizedBox(height: 8),
          ElevatedButton.icon(
            onPressed: () {
              // Crear nueva tarea
            },
            icon: const Icon(Icons.add),
            label: const Text('Nueva Tarea'),
          ),
        ],
      ),
    );
  }
}

// Import necesario
import 'package:supabase_flutter/supabase_flutter.dart';
