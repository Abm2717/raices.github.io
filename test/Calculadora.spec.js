import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import RaicesFunciones from '../src/components/Calculadora.vue'

describe('RaicesFunciones.vue', () => {
  it('muestra un mensaje de alerta si no se llenan los campos', async () => {
    const wrapper = mount(RaicesFunciones)

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Llena todos los campos correctamente')
  })

  it('muestra alerta si los límites no tienen signos opuestos', async () => {
    const wrapper = mount(RaicesFunciones)

    // setear valores con v-model
    await wrapper.find('select').setValue('f') // primera función
    await wrapper.findAll('select')[1].setValue('biseccion') // método bisección
    await wrapper.find('input[type="number"]').setValue(5) // límite inferior
    await wrapper.findAll('input[type="number"]')[1].setValue(6) // límite superior
    await wrapper.findAll('input[type="number"]')[2].setValue(0.001) // error

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Los valores de la función en los límites deben tener signos opuestos')
  })

  it('calcula raíz con método de Bisección', async () => {
    const wrapper = mount(RaicesFunciones)

    // seleccionamos función f
    await wrapper.find('select').setValue('f')
    // seleccionamos método bisección
    await wrapper.findAll('select')[1].setValue('biseccion')
    // valores numéricos que sí cumplen condición
    await wrapper.find('input[type="number"]').setValue(0)
    await wrapper.findAll('input[type="number"]')[1].setValue(1)
    await wrapper.findAll('input[type="number"]')[2].setValue(0.001)

    await wrapper.find('button').trigger('click')

    // verificar que aparecen resultados
    expect(wrapper.text()).toContain('Resultados del Análisis')
    expect(wrapper.text()).toContain('Biseccion')
    expect(wrapper.text()).toContain('Raíz encontrada')
  })

  it('cierra la alerta al dar clic en ×', async () => {
    const wrapper = mount(RaicesFunciones)

    await wrapper.find('button').trigger('click') // dispara alerta
    expect(wrapper.find('.alerta').exists()).toBe(true)

    await wrapper.find('.boton-cerrar').trigger('click')
    expect(wrapper.find('.alerta').exists()).toBe(false)
  })
})
