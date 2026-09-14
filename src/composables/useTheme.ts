import { ref } from 'vue'

const isDark = ref<boolean>(false)

// Inicializa el tema inmediatamente al importar
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('solident_theme')
  if (saved) {
    isDark.value = saved === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function useTheme() {
  function applyTheme(dark: boolean) {
    isDark.value = dark
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('solident_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('solident_theme', 'light')
    }
  }

  function toggleTheme() {
    applyTheme(!isDark.value)
  }

  return {
    isDark,
    toggleTheme,
  }
}
