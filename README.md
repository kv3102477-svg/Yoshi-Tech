# Yoshi Tech · Grupo 4

Sitio web de Yoshi Tech (soporte técnico, reparación y ensamblaje de equipos), hecho con **Material Design 3**.
Curso: Hojas de Estilo en Cascada Avanzado.

## Abrir en NetBeans

1. **File → Open Project…** y elige la carpeta `Css_Grupo4`. Es un proyecto *HTML5/JavaScript* y su raíz web es `public_html`.
2. Ejecuta con **Run Project (F6)**. Se abre `index.html` en el navegador.

La página ya viene compilada (`css/styles.css` y `js/material.js`), así que **no necesitas instalar nada para verla**. También funciona sin internet, porque las fuentes y los iconos están dentro de `public_html/fuentes`.

## Editar los estilos (SASS)

Los estilos se escriben en `public_html/scss/` y se compilan a `public_html/css/styles.css`. Hay dos formas de compilarlos.

**A) Con los scripts npm desde NetBeans (recomendado)**

1. Instala Node.js.
2. Clic derecho en el proyecto → **npm Install**. Solo hace falta la primera vez.
3. Clic derecho en el proyecto → **npm Scripts** y elige uno:

| Script | Qué hace |
|---|---|
| `build:css` | Compila el SASS una vez |
| `dev` | Vuelve a compilar cada vez que guardas un `.scss`. Déjalo corriendo mientras editas |
| `build:js` | Empaqueta los componentes de Material Web en `js/material.js` |
| `tema` | Genera los colores Material desde los colores de la marca (`scss/_tokens-color.scss`) |
| `build` | Ejecuta todos los anteriores |

**B) Compilar al guardar con el compilador SASS de NetBeans**

1. **Tools → Options → HTML/JS → CSS Preprocessors → Sass Path**. Ahí pon la ruta de `node_modules/.bin/sass` (en Windows es `sass.cmd`).
2. Clic derecho en el proyecto → **Properties → CSS Preprocessors**. Marca *Compile Sass Files on Save*. El mapeo `/scss:/css` ya está configurado.

## Estructura

```
Css_Grupo4/
├─ nbproject/            Configuración del proyecto NetBeans
├─ public_html/          ← Raíz web: esto es lo que se publica
│  ├─ index.html         Marco: header + menú lateral + contenido + footer
│  ├─ inicio.html        Páginas que se cargan en el cuadro central
│  ├─ servicios.html
│  ├─ galeria.html
│  ├─ contacto.html
│  ├─ css/styles.css     CSS compilado (no editar a mano)
│  ├─ scss/              Código fuente SASS
│  ├─ js/                script.js y material.js (componentes)
│  ├─ fuentes/           Roboto, Space Grotesk y Material Symbols
│  └─ imagenes/
├─ src/js/material.js    Lista de componentes Material que se empaquetan
├─ scripts/              Generador del tema de color Material
└─ package.json          Scripts npm
```

## Para publicar

Sube **solo la carpeta `public_html`** a cualquier hosting estático, por ejemplo GitHub Pages, Netlify o el hosting del cliente.

> El formulario de contacto valida los datos y muestra la confirmación, pero no envía correos porque no hay servidor. Para usarlo en producción hay que conectarlo a un servicio de formularios o a un backend.
