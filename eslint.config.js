import js from '@eslint/js'
import pluginSecurity from 'eslint-plugin-security'
import globals from 'globals'

export default [
  js.configs.recommended,
  pluginSecurity.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    files: ['src/**/*.js', 'src/**/*.vue'],
    rules: {
      // Reglas de seguridad activas
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-possible-timing-attacks': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error'
    }
  }
]