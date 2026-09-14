# Clínica Frontend

Clínica Frontend es una aplicación web desarrollada con Vue.js que permite gestionar de forma ágil y moderna los procesos de una clínica, incluyendo la programación de citas, la administración de pacientes y el seguimiento de historiales médicos. 

Construida con un enfoque en la usabilidad y el rendimiento, la interfaz ofrece una experiencia intuitiva tanto para el personal administrativo como para los profesionales de la salud, facilitando la digitalización de los procesos clínicos y mejorando la atención al paciente.

---

## 🎨 Prototipo del Proyecto
Puedes visualizar el diseño interactivo y los mockups del proyecto en el siguiente enlace:
👉 **[Ver Mockup en Figma](https://www.figma.com/proto/TbSSIxh8cYjkqocEnFiXMa/PROTOTIPO?node-id=1-2&t=lNHukFY7YZi1TaSp-1)**

---

## 🛠️ Herramientas de Desarrollo Frontend

Este proyecto fue estructurado utilizando **Vue 3** y **Vite**.

### Configuración Recomendada del IDE
* [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) *(asegúrate de deshabilitar Vetur)*.

### Extensiones del Navegador Recomendadas
* **Navegadores basados en Chromium (Chrome, Edge, Brave, etc.):**
  * [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  * [Activar Custom Object Formatter en Chrome DevTools](http://bit.ly/object-formatters)
* **Firefox:**
  * [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  * [Activar Custom Object Formatter en Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

---

## 💻 Comandos del Proyecto

### Instalación de dependencias
```sh
npm install
```

### Servidor de desarrollo (Localhhost)
```sh
npm run dev
```

### Compilar y minificar para producción
```sh
npm run build
```

### Ejecutar el Linter ([ESLint](https://eslint.org/))
```sh
npm run lint
```

---

## 📘 Notas de TypeScript para `.vue`
TypeScript no puede manejar la información de tipos para las importaciones `.vue` de forma predeterminada, por lo que reemplazamos el CLI `tsc` con `vue-tsc` para la verificación de tipos. En los editores, necesitamos [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para que el servicio de lenguaje de TypeScript detecte los tipos dentro de los archivos `.vue`.
