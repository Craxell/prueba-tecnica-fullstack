/**
 * Reglas de contraseña segura (registro).
 * Alineado con backend register.dto.
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireDigit: true,
  requireSpecial: true,
} as const

export const PASSWORD_HINT =
  'Mín. 8 caracteres, mayúscula, minúscula, número y un símbolo.'

const LOWER = /[a-z]/
const UPPER = /[A-Z]/
const DIGIT = /\d/
const SPECIAL = /[^A-Za-z0-9]/

export type PasswordValidationResult =
  | { ok: true }
  | { ok: false; message: string }

export function validateStrongPassword(
  password: string,
): PasswordValidationResult {
  if (!password?.length) {
    return { ok: false, message: 'La contraseña es obligatoria.' }
  }
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    return {
      ok: false,
      message: `Al menos ${PASSWORD_REQUIREMENTS.minLength} caracteres.`,
    }
  }
  if (PASSWORD_REQUIREMENTS.requireLowercase && !LOWER.test(password)) {
    return { ok: false, message: 'Incluye al menos una minúscula.' }
  }
  if (PASSWORD_REQUIREMENTS.requireUppercase && !UPPER.test(password)) {
    return { ok: false, message: 'Incluye al menos una mayúscula.' }
  }
  if (PASSWORD_REQUIREMENTS.requireDigit && !DIGIT.test(password)) {
    return { ok: false, message: 'Incluye al menos un número.' }
  }
  if (PASSWORD_REQUIREMENTS.requireSpecial && !SPECIAL.test(password)) {
    return {
      ok: false,
      message: 'Incluye al menos un símbolo (ej. !@#).',
    }
  }
  return { ok: true }
}

export function rhfStrongPassword(value: string): true | string {
  const r = validateStrongPassword(value)
  return r.ok ? true : r.message
}

export function rhfPasswordMatch(
  password: string,
  confirm: string,
): true | string {
  if (!confirm) return 'Repite la contraseña.'
  if (password !== confirm) return 'Las contraseñas no coinciden.'
  return true
}
