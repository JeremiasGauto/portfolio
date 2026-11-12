# Portfolio · Data Analyst

Sitio estático (HTML + CSS + JS, sin build) publicado con **GitHub Pages**.
Todo el contenido se edita en dos archivos JSON: no hace falta tocar código.

```
├── index.html
├── css/styles.css
├── js/main.js
├── data/
│   ├── profile.json     ← tus datos, skills, experiencia, contacto
│   └── projects.json    ← los proyectos (cards)
├── assets/
│   ├── cv.pdf           ← (opcional) tu CV
│   └── projects/<id>/   ← imágenes y videos de cada proyecto
├── scripts/validate.py  ← valida los JSON y que existan los archivos
└── .github/workflows/
    ├── deploy.yml       ← publica en Pages al actualizar main
    └── check.yml        ← valida cada Pull Request
```

## Ver el sitio en tu compu

El sitio lee los JSON con `fetch`, así que hay que abrirlo con un servidor local
(no con doble clic sobre `index.html`):

```bash
python -m http.server 8000
```

y entrá a <http://localhost:8000>.

---

## Git flow

| Rama          | Para qué                                        | Se crea desde | Se mergea a            |
|---------------|-------------------------------------------------|---------------|------------------------|
| `main`        | Lo que está publicado. **Cada push = deploy.**  | —             | —                      |
| `develop`     | Integración: lo próximo a publicar              | `main`        | —                      |
| `feature/*`   | Un proyecto nuevo o un cambio                   | `develop`     | `develop`              |
| `release/*`   | Preparar una publicación                        | `develop`     | `main` y `develop`     |
| `hotfix/*`    | Arreglo urgente de lo publicado                 | `main`        | `main` y `develop`     |

### 1. Agregar un proyecto (feature)

```bash
git checkout develop
git pull
git checkout -b feature/proyecto-dashboard-compras
```

1. Creá la carpeta `assets/projects/dashboard-compras/` y poné ahí las imágenes / videos.
2. Agregá una entrada en `data/projects.json` (ver formato abajo).
3. Probalo en local y validá:

   ```bash
   python scripts/validate.py
   ```

4. Commit y push:

   ```bash
   git add .
   git commit -m "feat: agrega proyecto dashboard de compras"
   git push -u origin feature/proyecto-dashboard-compras
   ```

5. Abrí un Pull Request **hacia `develop`**:

   ```bash
   gh pr create --base develop --fill
   ```

   El workflow *Validar contenido* corre solo. Si da OK, mergealo.

### 2. Publicar (release)

Cuando `develop` tiene lo que querés mostrar:

```bash
git checkout develop
git pull
git checkout -b release/2026-11
git push -u origin release/2026-11
gh pr create --base main --title "Release 2026-11" --body "Publica los últimos proyectos"
```

Al mergear el PR a `main`, GitHub Actions publica el sitio (1–2 minutos).
Después traé `main` de vuelta a `develop`:

```bash
git checkout develop
git pull
git merge origin/main
git push
```

### 3. Arreglo urgente (hotfix)

```bash
git checkout main
git pull
git checkout -b hotfix/typo-contacto
# ...arreglo...
git commit -am "fix: corrige link de contacto"
git push -u origin hotfix/typo-contacto
gh pr create --base main --fill
```

Después del merge, igual que en el release: mergeá `main` en `develop`.

---

## Formato de un proyecto

```jsonc
{
  "id": "dashboard-compras",                 // minúsculas-con-guiones, único
  "title": "Dashboard de compras",
  "date": "2026-11",                          // AAAA-MM (ordena las cards)
  "featured": true,                           // opcional: va primero y con badge
  "summary": "Una o dos líneas para la card.",
  "description": [                            // texto del detalle: un párrafo por elemento
    "El problema de negocio y el contexto.",
    "Cómo lo resolviste y qué impacto tuvo."
  ],
  "tools": ["Power BI", "DAX", "SQL"],        // generan los filtros y el gráfico del inicio
  "cover": { "type": "image", "src": "assets/projects/dashboard-compras/cover.png" },
  "media": [                                  // galería del detalle (fotos y videos)
    { "type": "image",   "src": "assets/projects/dashboard-compras/vista-1.png", "caption": "Vista general" },
    { "type": "video",   "src": "assets/projects/dashboard-compras/demo.mp4", "poster": "assets/projects/dashboard-compras/cover.png", "caption": "Demo navegando el tablero" },
    { "type": "youtube", "src": "https://www.youtube.com/watch?v=XXXXXXXXXXX", "caption": "Walkthrough" }
  ],
  "highlights": [                             // opcional: métricas destacadas
    { "label": "Horas ahorradas / mes", "value": "12" }
  ],
  "links": [                                  // opcional: botones
    { "label": "Ver dashboard", "url": "https://app.powerbi.com/view?r=..." },
    { "label": "Repositorio",   "url": "https://github.com/..." }
  ],
  "hidden": false                             // opcional: true para ocultarlo sin borrarlo
}
```

**Portada en video:** si `cover` es `{ "type": "video", ... }`, la card reproduce el video al pasar el mouse.

### Tips para fotos y videos

- Capturas en **PNG o WebP**, 1600 px de ancho alcanza. Proporción 16:10 o 16:9 para las portadas.
- Videos en **MP4 (H.264)**, sin audio si es una demo, idealmente < 20 MB.
  GitHub no acepta archivos de más de 100 MB; para videos largos, subilos a YouTube y usá `"type": "youtube"`.
- No subas datos reales de clientes o de la empresa: usá datos anonimizados o de ejemplo.

## Tus datos

Editá `data/profile.json`: nombre, bio, email, LinkedIn, skills y experiencia.
Para el CV, poné el PDF en `assets/cv.pdf` y en `profile.json` `"cv": "assets/cv.pdf"`.
Si completás `"careerStartYear": 2022`, el inicio muestra los años de experiencia.
