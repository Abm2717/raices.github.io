<script setup>
import { ref } from 'vue'
import { biseccion, reglaFalsa, valoresTabla } from './raicesFunciones'

const limiteInferior = ref(0)
const limiteSuperior = ref(1)
const errorMax = ref(0.001)
const funcionSeleccionada = ref('ninguno')
const metodoSeleccionado = ref('ninguno')
const mostrarAlerta = ref(false)
const msjAlerta = ref('')
const resultados = ref(null)

const f = x => (4*x**3) - (6*x**2) + (7*x) - 2.3
function g(x) {
    //let rad = x * (Math.PI / 180) // convertir x a radianes para cos
    return (x**2) * Math.sqrt(Math.abs(Math.cos(x))) - 5
}

const opcionesFunciones = [
  { value: 'ninguno', label: 'Selecciona función'},
  { value: 'f', label: 'f(x) = 4x³ - 6x² + 7x - 2.3' },
  { value: 'g', label: 'f(x) = x² * √|cos(x)| - 5' }
]

const opcionesMetodos = [
  { value: 'ninguno', label: 'Selecciona método'},
  { value: 'biseccion', label: 'Método de Bisección' },
  { value: 'reglaFalsa', label: 'Método de Regla Falsa' }
]

function bloquearTeclas(event) {
    if(["e", "E", "+"].includes(event.key)) {
        event.preventDefault()
        return
    }
}

function validarInputs() {
  if (limiteInferior.value === '' || limiteSuperior.value === '' || errorMax.value === '') {
    return false
  }
  
  if (funcionSeleccionada.value === 'ninguno' || metodoSeleccionado.value === 'ninguno') {
    return false
  }
  
  return true
}

function cerrarAlerta() {
  mostrarAlerta.value = false
}

function obtenerRaices() {
  mostrarAlerta.value = false
  if (!validarInputs()) {
    msjAlerta.value = 'Llena todos los campos correctamente'
    mostrarAlerta.value = true
    return
  }


  // Seleccionar la función
  let funcionAUsar
  if (funcionSeleccionada.value === 'f') {
    funcionAUsar = f  
  } else if (funcionSeleccionada.value === 'g') {
    funcionAUsar = g
  }

  
  const fa = funcionAUsar(limiteInferior.value)
  const fb = funcionAUsar(limiteSuperior.value)
  
  if (fa * fb > 0) {
    msjAlerta.value = 'Los valores de la función en los límites deben tener signos opuestos para garantizar una raiz'
    mostrarAlerta.value = true
    return
  }

  try {
    let resultado
    if (metodoSeleccionado.value === 'biseccion') {
      resultado = biseccion(funcionAUsar, limiteInferior.value, limiteSuperior.value, errorMax.value)
    } else if (metodoSeleccionado.value === 'reglaFalsa') {
      resultado = reglaFalsa(funcionAUsar, limiteInferior.value, limiteSuperior.value, errorMax.value)
    }
    
    console.log(resultado)
    if (resultado.mensaje) {
      msjAlerta.value = resultado.mensaje
      mostrarAlerta.value = true
      return
    }

    resultados.value = {
      ...resultado,
      metodo: metodoSeleccionado.value === 'biseccion' ? 'Biseccion' : 'Regla Falsa',
      funcion: funcionSeleccionada.value === 'f' ? 'f(x) = 4x³ - 6x² + 7x - 2.3' : 'f(x) = x² * √|cos(x)| - 5'
    }
    
    
  } catch (error) {
    msjAlerta.value = 'Error al calcular la raiz: ' + error.message
    mostrarAlerta.value = true
  }
}
</script>

<template>
  <div class="container">
    <h1> Obtener Raíces de Funciones</h1>
    <p>Ingresa los límites, selecciona la función, el método numérico y el error máximo para encontrar raíces.</p>
    
    <!-- Alerta de error -->
    <div v-if="mostrarAlerta" class="alerta">
      <div class="alerta-contenido">
        <span class="icono-alerta">⚠️</span>
        <span class="mensaje-alerta">{{ msjAlerta }}</span>
        <button class="boton-cerrar" @click="cerrarAlerta">×</button>
      </div>
    </div>

    <div class="inputs">
      <div class="selectores">
        <label class="selector-funcion">
          Función a analizar
          <select v-model="funcionSeleccionada" class="select-funcion">
            <option v-for="opcion in opcionesFunciones" :key="opcion.value" :value="opcion.value">
              {{ opcion.label }}
            </option>
          </select>
        </label>
        
        <label class="selector-metodo">
          Método numérico
          <select v-model="metodoSeleccionado" class="select-funcion">
            <option v-for="opcion in opcionesMetodos" :key="opcion.value" :value="opcion.value">
              {{ opcion.label }}
            </option>
          </select>
        </label>
      </div>
      
      <div class="inputs-numericos">
        <label>
          Valor de Xi
          <input type="number" v-model.number="limiteInferior" @keydown="bloquearTeclas" step="0.01" />
        </label>
        
        <label>
          Valor de Xf
          <input type="number" v-model.number="limiteSuperior" @keydown="bloquearTeclas" step="0.01" />
        </label>
        
        <label>
          Error máximo
          <input type="number" v-model.number="errorMax" @keydown="bloquearTeclas" min="0.0001" step="0.0001" />
        </label>
      </div>
    </div>
    
    <button @click="obtenerRaices" class="boton-principal">
      Calcular Raíz
    </button>
    
    <!-- Resultados -->
    <div v-if="resultados" class="resultados-wrapper">
      <div class="resultados-header">
        <h2>Resultados del Análisis</h2>
        <div class="metodo-usado">
          <span class="metodo-badge">{{ resultados.metodo }}</span>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-item raiz">
          <span class="stat-icon"></span>
          <span class="stat-label">Raíz encontrada</span>
          <span class="stat-value">{{ resultados.raiz }}</span>
        </div>
        
        <div class="stat-item funcion">
          <span class="stat-icon"></span>
          <span class="stat-label">f(raíz)</span>
          <span class="stat-value">{{ resultados.f_raiz }}</span>
        </div>
        
        <div class="stat-item error">
          <span class="stat-icon"></span>
          <span class="stat-label">Error final</span>
          <span class="stat-value">{{ resultados.error }}</span>
        </div>
        
        <div class="stat-item iteraciones">
          <span class="stat-icon"></span>
          <span class="stat-label">Iteraciones</span>
          <span class="stat-value">{{ resultados.iteraciones }}</span>
        </div>
      </div>
    </div>
    <div v-if="resultados && resultados.tabla" class="tabla-iteraciones">
      <h3>Iteraciones</h3>
      <table>
        <thead>
          <tr>
            <th>xi</th>
            <th>xf</th>
            <th>f(xi)</th>
            <th>f(xf)</th>
            <th>xr</th>
            <th>f(xr)</th>
            <th>f(xi)*f(xr)</th>
            <th>ea</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fila, index) in resultados.tabla" :key="index">
            <td>{{ fila.xi }}</td>
            <td>{{ fila.xf }}</td>
            <td>{{ fila.fxi }}</td>
            <td>{{ fila.fxf }}</td>
            <td>{{ fila.xr }}</td>
            <td>{{ fila.fxr }}</td>
            <td>{{ fila.prod }}</td>
            <td>{{ fila.ea }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
  margin: auto;
  padding: 2rem;
  background: #242424;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.6);
  font-family: system-ui, sans-serif;
  color: #f9fafb;
}

h1 {
  text-align: center;
  color: #60a5fa;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

p {
  color: #d1d5db;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Estilos para la alerta */
.alerta {
  margin-bottom: 1rem;
  animation: slideDown 0.3s ease-out;
}

.alerta-contenido {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #7c2d12;
  border: 1px solid #dc2626;
  border-radius: 0.5rem;
  color: #fef2f2;
  position: relative;
}

.icono-alerta {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.mensaje-alerta {
  flex: 1;
  font-weight: 500;
}

.boton-cerrar {
  background: none;
  border: none;
  color: #fef2f2;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin: 0;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.boton-cerrar:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.inputs {
  margin-bottom: 1.5rem;
}

.selectores {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.selector-funcion,
.selector-metodo {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #e5e7eb;
  flex: 1;
  min-width: 250px;
}

.inputs-numericos {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #e5e7eb;
  flex: 1;
  min-width: 120px;
}

input, .select-funcion {
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
  margin-top: 0.3rem;
  background: #1f1f1f;
  color: #f9fafb;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus, .select-funcion:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

.select-funcion {
  cursor: pointer;
}

/* Quitar spinner de inputs numéricos */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.boton-principal {
  display: block;
  margin: 1.5rem auto;
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.boton-principal:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.boton-principal:active {
  transform: translateY(0);
}

/* Estilos para los resultados */
.resultados-wrapper {
  margin-top: 2rem;
  background: #1f1f1f;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #333;
}

.resultados-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.resultados-header h2 {
  color: #60a5fa;
  margin: 0;
  font-size: 1.4rem;
}

.metodo-usado {
  display: flex;
  align-items: center;
}

.metodo-badge {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 2px solid;
  text-align: center;
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-item.raiz {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
}

.stat-item.funcion {
  background: rgba(168, 85, 247, 0.1);
  border-color: #a855f7;
}

.stat-item.error {
  background: rgba(249, 115, 22, 0.1);
  border-color: #f97316;
}

.stat-item.iteraciones {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #d1d5db;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.raiz .stat-value { color: #22c55e; }
.funcion .stat-value { color: #a855f7; }
.error .stat-value { color: #f97316; }
.iteraciones .stat-value { color: #3b82f6; }


.verificacion {
  font-family: 'Courier New', monospace;
  background: #0f0f0f;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #60a5fa;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .selectores {
    flex-direction: column;
  }
  
  .selector-funcion,
  .selector-metodo {
    min-width: auto;
  }
  
  .inputs-numericos {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .resultados-header {
    flex-direction: column;
    text-align: center;
  }
}

.tabla-iteraciones {
  margin-top: 2rem;
  overflow-x: auto;
}

.tabla-iteraciones table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  background: #1f1f1f;
  border-radius: 0.75rem;
  overflow: hidden;
}

.tabla-iteraciones th,
.tabla-iteraciones td {
  padding: 0.5rem;
  border: 1px solid #333;
}

.tabla-iteraciones th {
  background: #2563eb;
  color: white;
}

.tabla-iteraciones tr:nth-child(even) {
  background: #2d2d2d;
}

</style>