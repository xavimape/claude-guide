# Claude AI Guide

Guía técnica práctica de Claude AI para analistas de ciberseguridad y developers.
Cubre desde el uso básico en claude.ai hasta flujos avanzados con Claude Code, MCPs, OWASP y CI/CD.

**[→ Ver la guía en vivo](https://xavimape.github.io/claude-guide/)**

---

## ¿Qué incluye?

### Plataformas
| Módulo | Contenido |
|---|---|
| 🌐 Claude Web | Proyectos, Deep Research, prompting avanzado, XML tags |
| 🖥️ Desktop Windows | Chat nativo, Cowork, Claude Code con hooks y CI/CD |
| ⚡ VS Code Extension | Modelos, slash commands, referencias @, agentes multi-step |
| 🔗 MCP Servers | Shodan, VirusTotal, MISP, filesystem — config completa |

### Especializado
| Módulo | Contenido |
|---|---|
| 🔐 Ciberseguridad | Code review OWASP, CTF/exploits, threat modeling STRIDE, Burp/Nmap/MSF, OSINT y logs |
| 💻 Programación avanzada | Flujo arq→código→tests→refactor→docs, CLAUDE.md para monorepos, debugging, code review SOLID |
| 🔬 Investigación | Análisis de papers/RFCs, síntesis de fuentes, comparativas técnicas |
| ✍️ Escritura técnica | READMEs, OpenAPI 3.0, changelogs semánticos, post-mortems blameless |

---

## Estructura del proyecto

```
claude-guide/
├── index.html          # Página principal (SPA section-deck)
├── css/
│   └── styles.css      # Design system completo con variables CSS
├── js/
│   ├── canvas-bg.js    # HeroNetworkCanvas — red animada de partículas
│   └── main.js         # Section deck SPA · Acordeones · Stagger reveal
└── README.md
```

### Características técnicas
- **SPA sin frameworks**: navegación entre secciones sin recarga, animaciones CSS
- **Acordeones dinámicos**: subsecciones colapsables con `max-height` transitions
- **Canvas animado**: red de partículas interactiva en el hero (repel con mouse)
- **Stagger animations**: cards y bloques aparecen escalonados al entrar a cada sección
- **Sidebar animado**: entrada escalonada + sweep hover + pulse en ítem activo
- **Dark theme**: paleta violet/cyan/green/amber/red sobre `#08090D`
- **GitHub Pages ready**: `index.html` en raíz, rutas relativas, sin dependencias backend

---

## Desarrollo local

No requiere servidor. Abrí directamente `index.html` en Chrome.

O con un servidor local para evitar restricciones `file://`:

```bash
# Python (cualquier versión)
python -m http.server 8080
# → http://localhost:8080

# Node (si tenés npx)
npx serve .
# → http://localhost:3000
```

---

## Personalización

### Cambiar colores (CSS variables en `css/styles.css`)

```css
:root {
  --violet: #7C5CFC;   /* color principal — sidebar, acentos */
  --cyan:   #00D4FF;   /* color secundario — activos, cyan */
  --green:  #00E5A0;   /* éxito, secciones especializadas */
  --amber:  #F5A623;   /* advertencias, escritura técnica */
  --red:    #FF4D6A;   /* errores, ciberseguridad */
}
```

### Ajustar la red de partículas (`js/canvas-bg.js`)

```js
this.config = {
  nodeCount:  55,    // cantidad de nodos
  maxDist:   140,    // distancia máxima para conectar nodos
  nodeSpeed: 0.28,   // velocidad de movimiento
  mouseRepel: 90,    // radio de repulsión del cursor
};
```

### Agregar una sección

1. Añadí `<section id="mi-seccion">` en `index.html` antes del `</main>`
2. Agregá el link en el sidebar: `<a href="#mi-seccion" class="sidebar-link">...</a>`
3. El JS detecta automáticamente la sección nueva (no requiere cambios en `main.js`)

---

## Tecnologías

| Tech | Uso |
|---|---|
| HTML5 semántico | Estructura, accesibilidad |
| CSS3 custom properties | Design tokens, animaciones, acordeones |
| Vanilla JS (ES5+) | SPA, acordeones, stagger, canvas |
| Canvas API | Red animada de partículas en el hero |
| Google Fonts CDN | Space Grotesk · Inter · JetBrains Mono |

Sin frameworks, sin bundlers, sin dependencias npm. Funciona offline desde `file://`.

---

## Licencia

Contenido de uso personal y educativo.
Copyright (c) 2026 Javier Mapelli.
