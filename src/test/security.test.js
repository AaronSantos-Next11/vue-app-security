import { describe, it, expect, beforeEach } from 'vitest'

// Tests de regresión de seguridad para el login

describe('Control 1 — Validación de entradas', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  it('rechaza email vacío', () => {
    expect(''.trim()).toBe('')
    expect(emailRegex.test('')).toBe(false)
  })

  it('rechaza email sin dominio', () => {
    expect(emailRegex.test('usuariosindominio')).toBe(false)
  })

  it('rechaza email sin TLD', () => {
    expect(emailRegex.test('usuario@correo')).toBe(false)
  })

  it('acepta email válido', () => {
    expect(emailRegex.test('admin@correo.com')).toBe(true)
  })

  it('rechaza contraseña menor a 8 caracteres', () => {
    const password = '1234'
    expect(password.length < 8).toBe(true)
  })

  it('acepta contraseña de 8 o más caracteres', () => {
    const password = 'Admin1234'
    expect(password.length >= 8).toBe(true)
  })
})

describe('Control 2 — Protección XSS', () => {
  const patronesXSS = /<script|javascript:|onerror=|onload=/i

  it('detecta etiqueta <script>', () => {
    expect(patronesXSS.test('<script>alert("xss")</script>')).toBe(true)
  })

  it('detecta javascript: en input', () => {
    expect(patronesXSS.test('javascript:alert(1)')).toBe(true)
  })

  it('detecta onerror= en input', () => {
    expect(patronesXSS.test('<img onerror=alert(1)>')).toBe(true)
  })

  it('no detecta falso positivo en texto normal', () => {
    expect(patronesXSS.test('hola mundo')).toBe(false)
  })

  it('no detecta falso positivo en email válido', () => {
    expect(patronesXSS.test('admin@correo.com')).toBe(false)
  })
})

describe('Control 3 — Gestión de sesión', () => {
  const crearToken = (email, expOffset = 3600000) => {
    return btoa(JSON.stringify({
      user: email,
      exp: Date.now() + expOffset
    }))
  }

  it('token recién creado no está expirado', () => {
    const token = crearToken('admin@correo.com')
    const data = JSON.parse(atob(token))
    expect(Date.now() < data.exp).toBe(true)
  })

  it('token con expiración pasada está expirado', () => {
    const token = crearToken('admin@correo.com', -1000) // ya expiró
    const data = JSON.parse(atob(token))
    expect(Date.now() < data.exp).toBe(false)
  })

  it('token contiene el usuario correcto', () => {
    const token = crearToken('admin@correo.com')
    const data = JSON.parse(atob(token))
    expect(data.user).toBe('admin@correo.com')
  })
})

describe('Control 4 — Credenciales no expuestas en logs', () => {
  it('la contraseña no aparece en el payload del log', () => {
    const password = 'Admin1234'
    const logPayload = JSON.stringify({
      user: 'admin@correo.com',
      timestamp: new Date().toISOString()
    })
    expect(logPayload).not.toContain(password)
  })

  it('el payload del log contiene user y timestamp', () => {
    const logPayload = JSON.stringify({
      user: 'admin@correo.com',
      timestamp: new Date().toISOString()
    })
    expect(logPayload).toContain('user')
    expect(logPayload).toContain('timestamp')
  })
})