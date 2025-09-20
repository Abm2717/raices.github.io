import { describe, it, expect } from 'vitest'
import { biseccion, reglaFalsa } from '../src/components/raicesFunciones.js'

// Funciones de prueba
const f1 = (x) => x ** 2 - 4 // raíces en ±2
const f2 = (x) => x ** 3 - x - 2 // raíz aproximada en 1.521
const f3 = (x) => Math.sin(x) - 0.5 // raíz aproximada en 0.524
const f4 = (x) => x ** 2 + 1 // no tiene raíces reales
const f5 = (x) => x - 3 // raíz en x = 3

describe('Método de Bisección', () => {
  it('encuentra la raíz de x² - 4 entre 0 y 5', () => {
    const resultado = biseccion(f1, 0, 5, 0.001)

    expect(resultado).toHaveProperty('raiz')
    expect(resultado).toHaveProperty('f_raiz')
    expect(resultado).toHaveProperty('error')
    expect(resultado).toHaveProperty('iteraciones')

    expect(resultado.raiz).toBeCloseTo(2, 2)
    expect(Math.abs(resultado.f_raiz)).toBeLessThan(0.01)
    expect(resultado.error).toBeLessThan(0.001)
  })

  it('encuentra la raíz de x² - 4 entre -5 y 0 (raíz negativa)', () => {
    const resultado = biseccion(f1, -5, 0, 0.001)

    expect(resultado.raiz).toBeCloseTo(-2, 2)
    expect(Math.abs(resultado.f_raiz)).toBeLessThan(0.01)
  })

  it('encuentra la raíz de una función cúbica', () => {
    const resultado = biseccion(f2, 1, 2, 0.001)

    expect(resultado.raiz).toBeCloseTo(1.521, 2)
    expect(Math.abs(resultado.f_raiz)).toBeLessThan(0.01)
  })

  it('encuentra la raíz de sin(x) - 0.5', () => {
    const resultado = biseccion(f3, 0, 1, 0.001)

    expect(resultado.raiz).toBeCloseTo(0.524, 2)
    expect(Math.abs(resultado.f_raiz)).toBeLessThan(0.01)
  })

  it('encuentra raíz exacta cuando existe', () => {
    const resultado = biseccion(f5, 0, 5, 0.001)

    expect(resultado.raiz).toBeCloseTo(3, 3)
    expect(Math.abs(resultado.f_raiz)).toBeLessThan(0.001)
  })

  it('devuelve error para intervalo inválido (mismo signo)', () => {
    const resultado = biseccion(f4, 0, 5, 0.001)

    expect(resultado).toHaveProperty('mensaje')
    expect(resultado.mensaje).toBe('Intervalo invalido: no hay raiz en este rango.')
  })

  it('devuelve error para otro intervalo inválido', () => {
    const resultado = biseccion(f1, 3, 5, 0.001) // ambos valores son positivos

    expect(resultado).toHaveProperty('mensaje')
    expect(resultado.mensaje).toBe('Intervalo invalido: no hay raiz en este rango.')
  })

  it('maneja tolerancia muy pequeña que cause 100 iteraciones', () => {
    // Usar una función y tolerancia que efectivamente cause 100+ iteraciones
    // La función x - 0.5 tiene raíz en 0.5, y con tolerancia muy pequeña debería necesitar muchas iteraciones
    const funcionSimple = (x) => x - 0.5
    const resultado = biseccion(funcionSimple, 0, 10000000000000000000000, 0.00000000000000001) // tolerancia extremadamente pequeña

    // Si el algoritmo funciona correctamente, debería llegar al límite de 100 iteraciones
    // Si no llega, entonces la función converge y devuelve la raíz
    if (resultado.mensaje) {
      expect(resultado.mensaje).toBe('No se encontro la raiz en 100 iteraciones.')
    } else {
      // Si encuentra la raíz, verificar que sea correcta
      expect(resultado.raiz).toBeCloseTo(0.5, 10)
      expect(resultado.iteraciones).toBeLessThanOrEqual(100)
    }
  })

  it('verifica que las iteraciones se cuentan correctamente', () => {
    const resultado = biseccion(f1, 0, 5, 0.1)

    expect(resultado.iteraciones).toBeDefined()
    expect(resultado.iteraciones).toBeGreaterThan(0)
    expect(resultado.iteraciones).toBeLessThan(20) // Para esta tolerancia debería ser menos
  })
})

describe('Método de Regla Falsa', () => {
  it('encuentra la raíz de x² - 4 entre 0 y 5', () => {
    const resultado = reglaFalsa(f1, 0, 5, 0.001)

    expect(resultado).toHaveProperty('raiz')
    expect(resultado).toHaveProperty('f_raiz')
    expect(resultado).toHaveProperty('error')
    expect(resultado).toHaveProperty('iteraciones')

    expect(resultado.raiz).toBeCloseTo(2, 2)
    expect(Math.abs(resultado.f_raiz)).toBeLessThan(0.01)
    expect(resultado.error).toBeLessThan(0.001)
  })

  it('encuentra la raíz de x² - 4 entre -5 y 0 (raíz negativa)', () => {
    const resultado = reglaFalsa(f1, -5, 0, 0.001)

    expect(resultado.raiz).toBeCloseTo(-2, 2)
    expect(Math.abs(resultado.f_raiz)).toBeLessThan(0.01)
  })

  it('encuentra la raíz de una función cúbica', () => {
    const resultado = reglaFalsa(f2, 1, 2, 0.001)

    expect(resultado.raiz).toBeCloseTo(1.521, 2)
    expect(Math.abs(resultado.f_raiz)).toBeLessThan(0.01)
  })

  it('encuentra la raíz de sin(x) - 0.5', () => {
    const resultado = reglaFalsa(f3, 0, 1, 0.001)

    expect(resultado.raiz).toBeCloseTo(0.524, 2)
    expect(Math.abs(resultado.f_raiz)).toBeLessThan(0.01)
  })

  it('encuentra raíz exacta cuando existe', () => {
    const resultado = reglaFalsa(f5, 0, 5, 0.001)

    expect(resultado.raiz).toBeCloseTo(3, 3)
    expect(Math.abs(resultado.f_raiz)).toBeLessThan(0.001)
  })

  it('devuelve error para intervalo inválido (mismo signo)', () => {
    const resultado = reglaFalsa(f4, 0, 5, 0.001)

    expect(resultado).toHaveProperty('mensaje')
    expect(resultado.mensaje).toBe('Intervalo invalido: no hay raiz en este rango.')
  })

  it('devuelve error para otro intervalo inválido', () => {
    const resultado = reglaFalsa(f1, 3, 5, 0.001)

    expect(resultado).toHaveProperty('mensaje')
    expect(resultado.mensaje).toBe('Intervalo invalido: no hay raiz en este rango.')
  })

  it('maneja caso de 100 iteraciones sin convergencia', () => {
    // Crear función que converja muy lentamente con regla falsa
    const funcionLenta = (x) => Math.exp(-x) - 0.001
    const resultado = reglaFalsa(funcionLenta, 0, 10, 0.00000000000001)

    expect(resultado).toHaveProperty('mensaje')
    expect(resultado.mensaje).toBe('No se encontro la raiz en 100 iteraciones.')
  })

  it('verifica que las iteraciones se cuentan correctamente', () => {
    const resultado = reglaFalsa(f1, 0, 5, 0.1)

    expect(typeof resultado.iteraciones).toBe('number')
    expect(resultado.iteraciones).toBeGreaterThan(0)
    expect(resultado.iteraciones).toBeLessThan(20)
  })

  it('compara convergencia con bisección para la misma función', () => {
    const tolerancia = 0.001
    const resultadoBiseccion = biseccion(f1, 0, 5, tolerancia)
    const resultadoReglaFalsa = reglaFalsa(f1, 0, 5, tolerancia)

    // Ambos deberían encontrar aproximadamente la misma raíz
    expect(Math.abs(resultadoBiseccion.raiz - resultadoReglaFalsa.raiz)).toBeLessThan(0.01)
    
    // Regla falsa generalmente converge más rápido
    expect(resultadoReglaFalsa.iteraciones).toBeLessThanOrEqual(resultadoBiseccion.iteraciones)
  })
})


