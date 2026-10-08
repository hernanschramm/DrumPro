// ============================================================
// DrumPro Academy - Dashboard de Administrador
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/constants/app_strings.dart';
import '../auth/presentation/auth_provider.dart';

/// Dashboard principal del administrador
class AdminDashboard extends ConsumerStatefulWidget {
  const AdminDashboard({super.key});

  @override
  ConsumerState<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends ConsumerState<AdminDashboard> {
  int _currentIndex = 0;
  List<Map<String, dynamic>> _users = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  /// Cargar usuarios desde Supabase
  Future<void> _loadUsers() async {
    setState(() => _isLoading = true);
    
    try {
      final response = await Supabase.instance.client
          .from('profiles')
          .select()
          .order('created_at', ascending: false);
      
      setState(() {
        _users = response;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error al cargar usuarios: $e')),
        );
      }
    }
  }

  /// Crear nuevo usuario
  Future<void> _createUser() async {
    // Implementar diálogo de creación
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nuevo Usuario'),
        content: const Text('Formulario de creación (implementar)'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // Implementar lógica de creación
            },
            child: const Text('Crear'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('👤 Panel de Administrador'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await ref.read(authStateProvider.notifier).signOut();
            },
          ),
        ],
      ),
      body: _currentIndex == 0
          ? _buildUsersTab()
          : _currentIndex == 1
              ? _buildMetricsTab()
              : _buildCatalogTab(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.people),
            label: 'Usuarios',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart),
            label: 'Métricas',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.library_books),
            label: 'Catálogo',
          ),
        ],
      ),
      floatingActionButton: _currentIndex == 0
          ? FloatingActionButton(
              onPressed: _createUser,
              child: const Icon(Icons.add),
            )
          : null,
    );
  }

  /// Pestaña de usuarios
  Widget _buildUsersTab() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _users.length,
      itemBuilder: (context, index) {
        final user = _users[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: user['role'] == 'admin'
                  ? Colors.purple
                  : user['role'] == 'profesor'
                      ? Colors.blue
                      : Colors.green,
              child: Text(
                user['full_name'][0].toUpperCase(),
                style: const TextStyle(color: Colors.white),
              ),
            ),
            title: Text(user['full_name']),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user['email']),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: user['role'] == 'admin'
                        ? Colors.purple.shade100
                        : user['role'] == 'profesor'
                            ? Colors.blue.shade100
                            : Colors.green.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    user['role'],
                    style: const TextStyle(fontSize: 12),
                  ),
                ),
              ],
            ),
            trailing: PopupMenuButton(
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'edit',
                  child: Text('Editar'),
                ),
                const PopupMenuItem(
                  value: 'toggle',
                  child: Text('Activar/Desactivar'),
                ),
                const PopupMenuItem(
                  value: 'delete',
                  child: Text('Eliminar'),
                ),
              ],
              onSelected: (value) {
                // Implementar acciones
              },
            ),
          ),
        );
      },
    );
  }

  /// Pestaña de métricas
  Widget _buildMetricsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildMetricCard('Usuarios totales', _users.length.toString(), Icons.people),
          const SizedBox(height: 12),
          _buildMetricCard(
            'Profesores',
            _users.where((u) => u['role'] == 'profesor').length.toString(),
            Icons.school,
          ),
          const SizedBox(height: 12),
          _buildMetricCard(
            'Alumnos',
            _users.where((u) => u['role'] == 'alumno').length.toString(),
            Icons.person,
          ),
        ],
      ),
    );
  }

  /// Pestaña de catálogo
  Widget _buildCatalogTab() {
    return const Center(
      child: Text('Catálogo de rudimentos y grooves (implementar)'),
    );
  }

  /// Card de métrica
  Widget _buildMetricCard(String title, String value, IconData icon) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(icon, size: 48, color: Theme.of(context).primaryColor),
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
