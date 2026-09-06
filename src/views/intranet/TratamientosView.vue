<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

interface TratamientoItem {
  id: string
  nombre: string
  categoria: string
  precio: number
  duracion: string
  estado: 'ACTIVO' | 'INACTIVO'
}

const tratamientos = ref<TratamientoItem[]>([
  {
    id: 'TRAT-001',
    nombre: 'Limpieza Dental Profunda (Profilaxis)',
    categoria: 'Preventiva',
    precio: 70,
    duracion: '45 min',
    estado: 'ACTIVO',
  },
  {
    id: 'TRAT-002',
    nombre: 'Ortodoncia con Brackets Metálicos',
    categoria: 'Ortodoncia',
    precio: 180,
    duracion: '60 min',
    estado: 'ACTIVO',
  },
  {
    id: 'TRAT-003',
    nombre: 'Implante Dental de Titanio',
    categoria: 'Cirugía',
    precio: 550,
    duracion: '90 min',
    estado: 'ACTIVO',
  },
  {
    id: 'TRAT-004',
    nombre: 'Blanqueamiento Dental Láser',
    categoria: 'Estética',
    precio: 150,
    duracion: '45 min',
    estado: 'ACTIVO',
  },
  {
    id: 'TRAT-005',
    nombre: 'Endodoncia Unirradicular',
    categoria: 'Endodoncia',
    precio: 120,
    duracion: '60 min',
    estado: 'ACTIVO',
  },
])

const busqueda = ref('')
</script>

<template>
  <DashboardLayout>
    <div class="tratamientos-view">
      <div class="view-header">
        <div>
          <h2 class="view-title">Catálogo de Tratamientos</h2>
          <p class="view-desc">Administra los procedimientos, tarifas y duración clínica.</p>
        </div>
        <button class="btn-nuevo" type="button">+ Nuevo Tratamiento</button>
      </div>

      <div class="table-card">
        <div class="filter-bar">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar tratamiento o categoría..."
            class="search-input"
          />
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre del Tratamiento</th>
                <th>Categoría</th>
                <th>Precio Base</th>
                <th>Duración</th>
                <th>Estado</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in tratamientos.filter(
                  (t) =>
                    t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                    t.categoria.toLowerCase().includes(busqueda.toLowerCase()),
                )"
                :key="item.id"
              >
                <td class="font-mono">{{ item.id }}</td>
                <td class="font-semibold">{{ item.nombre }}</td>
                <td>
                  <span class="badge-cat">{{ item.categoria }}</span>
                </td>
                <td class="font-semibold text-emerald">S/ {{ item.precio }}.00</td>
                <td>{{ item.duracion }}</td>
                <td>
                  <span class="badge-status activo">{{ item.estado }}</span>
                </td>
                <td class="text-right">
                  <button class="btn-action edit" title="Editar">✏️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.tratamientos-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.view-desc {
  font-size: 0.92rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.btn-nuevo {
  background: linear-gradient(135deg, #5046e5 0%, #4338ca 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.4rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(80, 70, 229, 0.25);
}

.btn-nuevo:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.filter-bar {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.search-input {
  width: 100%;
  max-width: 360px;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.9rem;
  outline: none;
}

.search-input:focus {
  border-color: #5046e5;
  box-shadow: 0 0 0 3px rgba(80, 70, 229, 0.1);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.data-table th {
  background: #f8fafc;
  padding: 0.9rem 1.25rem;
  font-weight: 700;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.font-mono {
  font-family: monospace;
  font-size: 0.85rem;
  color: #64748b;
}

.font-semibold {
  font-weight: 600;
}

.text-emerald {
  color: #059669;
}

.text-right {
  text-align: right;
}

.badge-cat {
  background: #e0e7ff;
  color: #4338ca;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
}

.badge-status.activo {
  background: #dcfce7;
  color: #15803d;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.btn-action {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.btn-action:hover {
  background: #f1f5f9;
}
</style>
