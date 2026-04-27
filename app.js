const commands = [
  ["docker --version", "Verifica que Docker esté instalado y muestra la versión."],
  ["docker pull nginx", "Descarga una imagen desde Docker Hub."],
  ["docker run -d -p 8080:80 --name web nginx", "Crea un contenedor Nginx en segundo plano y publica el puerto 80 como 8080."],
  ["docker ps", "Lista contenedores en ejecución."],
  ["docker ps -a", "Lista también contenedores detenidos."],
  ["docker logs web", "Muestra los logs del contenedor llamado web."],
  ["docker exec -it web sh", "Abre una shell dentro del contenedor."],
  ["docker stop web", "Detiene el contenedor."],
  ["docker rm web", "Borra el contenedor detenido."],
  ["docker images", "Lista imágenes locales."],
  ["docker build -t mi-app .", "Construye una imagen desde el Dockerfile del directorio actual."],
  ["docker compose up -d", "Levanta los servicios definidos en compose.yaml."],
  ["docker volume ls", "Muestra los volúmenes creados para datos persistentes."],
  ["docker network ls", "Lista las redes disponibles para conectar contenedores."],
  ["docker system prune", "Limpia recursos sin uso. Úsalo con cuidado porque elimina contenedores detenidos e imágenes no usadas."],
];

const recipes = {
  node: `FROM node:22-alpine
WORKDIR /app

# Instala dependencias primero para aprovechar cache.
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
  python: `FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 5000
CMD ["python", "app.py"]`,
  nginx: `FROM nginx:1.27-alpine

# Copia archivos estáticos al directorio público de Nginx.
COPY ./dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
};

const projects = {
  cv: {
    title: "Curriculum personal",
    tag: "HTML + Nginx",
    level: "Entrada",
    outcome: "Terminarás con una página personal empaquetada en Docker y servida desde Nginx.",
    preview: `
      <p class="text-xs font-bold uppercase tracking-wide text-ocean">Ana López</p>
      <h4 class="mt-1 text-xl font-black text-ink">Desarrolladora web junior</h4>
      <p class="mt-2 text-sm text-slate-600">Perfil, experiencia, habilidades y contacto en una página lista para publicar.</p>
      <div class="mt-4 grid gap-2 text-xs font-bold text-slate-700">
        <span class="rounded bg-slate-100 px-2 py-1">HTML semántico</span>
        <span class="rounded bg-slate-100 px-2 py-1">CSS responsivo</span>
        <span class="rounded bg-slate-100 px-2 py-1">Dockerfile Nginx</span>
      </div>`,
    steps: [
      {
        title: "Crear carpeta",
        detail: "Copia estos comandos para crear y entrar al proyecto.",
        code: "mkdir cv-personal\ncd cv-personal",
      },
      {
        title: "Crear index.html",
        detail: "Copia este archivo completo. Luego cambia nombre, datos y experiencia.",
        code: String.raw`<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Curriculum personal</title>
    <style>
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; background: #eef2f7; color: #172033; }
main { width: min(920px, 100%); margin: auto; padding: 20px; }
header, section { background: white; border-radius: 8px; padding: 20px; margin-bottom: 14px; }
h1, h2 { margin: 0 0 10px; }
.grid { display: grid; gap: 14px; }
.tag { display: inline-block; margin: 4px 6px 4px 0; padding: 7px 10px; border-radius: 6px; background: #dbeafe; font-weight: bold; }
@media (min-width: 720px) { .grid { grid-template-columns: 1fr 1fr; } }
    </style>
  </head>
  <body>
    <main>
<header>
  <h1>Ana Lopez</h1>
  <p>Desarrolladora web junior | Guatemala | ana@email.com</p>
</header>
<section>
  <h2>Perfil</h2>
  <p>Me interesa construir sitios web claros, rapidos y faciles de usar.</p>
</section>
<div class="grid">
  <section>
    <h2>Experiencia</h2>
    <p><b>Proyecto academico:</b> sitio web responsivo con HTML, CSS y Docker.</p>
  </section>
  <section>
    <h2>Habilidades</h2>
    <span class="tag">HTML</span><span class="tag">CSS</span><span class="tag">Docker</span>
  </section>
</div>
    </main>
  </body>
</html>`,
      },
      {
        title: "Crear Dockerfile",
        detail: "Este archivo sirve el curriculum con Nginx.",
        code: "FROM nginx:alpine\nCOPY index.html /usr/share/nginx/html/index.html\nEXPOSE 80",
      },
      {
        title: "Construir y ejecutar",
        detail: "Levanta el proyecto en http://localhost:8080.",
        code: "docker build -t cv-personal .\ndocker run -d -p 8080:80 --name cv cv-personal",
      },
      {
        title: "Detener y limpiar",
        detail: "Usa esto cuando termines de probar.",
        code: "docker stop cv\ndocker rm cv",
      },
    ],
  },
  menu: {
    title: "App web de menú",
    tag: "HTML + JS",
    level: "Práctico",
    outcome: "Tendrás un menú interactivo con categorías, precios y búsqueda, listo para mostrar en un teléfono.",
    preview: `
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-ember">Café Central</p>
          <h4 class="text-xl font-black text-ink">Menú digital</h4>
        </div>
        <span class="rounded bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">Abierto</span>
      </div>
      <div class="mt-4 space-y-2 text-sm">
        <p class="flex justify-between rounded bg-slate-100 px-3 py-2"><span>Panini</span><b>Q32</b></p>
        <p class="flex justify-between rounded bg-slate-100 px-3 py-2"><span>Limonada</span><b>Q18</b></p>
      </div>`,
    steps: [
      {
        title: "Crear carpeta",
        detail: "Prepara el proyecto del menu.",
        code: "mkdir menu-web\ncd menu-web",
      },
      {
        title: "Crear index.html",
        detail: "App completa con productos, filtro por categoria y busqueda.",
        code: String.raw`<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Menu digital</title>
    <style>
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; background: #fff7ed; color: #1f2937; }
main { width: min(980px, 100%); margin: auto; padding: 16px; }
input, button { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; }
button { cursor: pointer; font-weight: bold; background: white; }
button.activo { background: #f97316; color: white; }
.filtros { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 12px 0; }
.menu { display: grid; gap: 12px; }
.item { background: white; border-radius: 8px; padding: 14px; box-shadow: 0 8px 20px #0001; }
.precio { color: #16a34a; font-weight: bold; }
@media (min-width: 720px) { .filtros { grid-template-columns: repeat(4, 1fr); } .menu { grid-template-columns: repeat(3, 1fr); } }
    </style>
  </head>
  <body>
    <main>
<h1>Cafe Central</h1>
<input id="buscar" placeholder="Buscar producto" />
<div class="filtros" id="filtros"></div>
<section class="menu" id="menu"></section>
    </main>
    <script>
const productos = [
  { nombre: "Panini", categoria: "almuerzo", precio: "Q32", descripcion: "Pan artesanal con pollo y queso." },
  { nombre: "Cafe latte", categoria: "bebidas", precio: "Q22", descripcion: "Cafe con leche cremosa." },
  { nombre: "Waffles", categoria: "desayuno", precio: "Q30", descripcion: "Con fruta y miel." },
  { nombre: "Cheesecake", categoria: "postres", precio: "Q26", descripcion: "Porcion individual." },
];
const categorias = ["todos", "desayuno", "almuerzo", "bebidas", "postres"];
let categoria = "todos";
const menu = document.querySelector("#menu");
const buscar = document.querySelector("#buscar");
const filtros = document.querySelector("#filtros");

function pintarFiltros() {
  filtros.innerHTML = categorias.map((cat) => '<button class="' + (cat === categoria ? "activo" : "") + '" data-cat="' + cat + '">' + cat + '</button>').join("");
}

function pintarMenu() {
  const texto = buscar.value.toLowerCase();
  const visibles = productos.filter((p) => (categoria === "todos" || p.categoria === categoria) && p.nombre.toLowerCase().includes(texto));
  menu.innerHTML = visibles.map((p) => '<article class="item"><h2>' + p.nombre + '</h2><p>' + p.descripcion + '</p><p class="precio">' + p.precio + '</p></article>').join("");
}

filtros.addEventListener("click", (e) => {
  if (!e.target.dataset.cat) return;
  categoria = e.target.dataset.cat;
  pintarFiltros();
  pintarMenu();
});
buscar.addEventListener("input", pintarMenu);
pintarFiltros();
pintarMenu();
    <\/script>
  </body>
</html>`,
      },
      {
        title: "Crear Dockerfile",
        detail: "Sirve la app estatica con Nginx.",
        code: "FROM nginx:alpine\nCOPY index.html /usr/share/nginx/html/index.html\nEXPOSE 80",
      },
      {
        title: "Construir y ejecutar",
        detail: "Abre http://localhost:8081 para probar el menu.",
        code: "docker build -t menu-web .\ndocker run -d -p 8081:80 --name menu menu-web",
      },
      {
        title: "Detener y limpiar",
        detail: "Limpia el contenedor cuando termines.",
        code: "docker stop menu\ndocker rm menu",
      },
    ],
  },
  tasks: {
    title: "Lista de tareas",
    tag: "JS + LocalStorage",
    level: "Intermedio",
    outcome: "Construirás una app pequeña que guarda tareas en el navegador y se mantiene al recargar.",
    preview: `
      <h4 class="text-xl font-black text-ink">Mis tareas</h4>
      <div class="mt-4 space-y-2 text-sm">
        <p class="rounded bg-slate-100 px-3 py-2">Preparar Dockerfile</p>
        <p class="rounded bg-emerald-100 px-3 py-2 text-emerald-800">Probar contenedor</p>
        <p class="rounded bg-slate-100 px-3 py-2">Documentar comandos</p>
      </div>`,
    steps: [
      {
        title: "Crear carpeta",
        detail: "Prepara el proyecto de tareas.",
        code: "mkdir tareas-app\ncd tareas-app",
      },
      {
        title: "Crear index.html",
        detail: "App completa con formulario, completar, borrar y localStorage.",
        code: String.raw`<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lista de tareas</title>
    <style>
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; background: #eef2ff; color: #111827; }
main { width: min(720px, 100%); margin: auto; padding: 16px; }
form { display: grid; gap: 8px; grid-template-columns: 1fr; }
input, button { padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; }
button { cursor: pointer; font-weight: bold; background: #2563eb; color: white; }
ul { list-style: none; padding: 0; display: grid; gap: 10px; }
li { background: white; border-radius: 8px; padding: 12px; display: grid; gap: 8px; }
li.completa span { text-decoration: line-through; color: #6b7280; }
.acciones { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.gris { background: #64748b; }
.rojo { background: #dc2626; }
@media (min-width: 600px) { form { grid-template-columns: 1fr auto; } li { grid-template-columns: 1fr 220px; align-items: center; } }
    </style>
  </head>
  <body>
    <main>
<h1>Mis tareas</h1>
<form id="formulario">
  <input id="texto" placeholder="Nueva tarea" required />
  <button>Agregar</button>
</form>
<ul id="lista"></ul>
    </main>
    <script>
      let tareas = JSON.parse(localStorage.getItem("tareas") || "[]");
const formulario = document.querySelector("#formulario");
const texto = document.querySelector("#texto");
const lista = document.querySelector("#lista");

function guardar() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function pintar() {
  lista.innerHTML = tareas.map((tarea, i) => '<li class="' + (tarea.lista ? "completa" : "") + '"><span>' + tarea.texto + '</span><div class="acciones"><button class="gris" data-ok="' + i + '">Completar</button><button class="rojo" data-del="' + i + '">Borrar</button></div></li>').join("");
}

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  tareas.push({ texto: texto.value, lista: false });
  texto.value = "";
  guardar();
  pintar();
});

lista.addEventListener("click", (e) => {
  if (e.target.dataset.ok) tareas[e.target.dataset.ok].lista = !tareas[e.target.dataset.ok].lista;
  if (e.target.dataset.del) tareas.splice(e.target.dataset.del, 1);
  guardar();
  pintar();
});

pintar();
    <\/script>
  </body>
</html>`,
},
{
  title: "Crear Dockerfile",
  detail: "Empaqueta la app con Nginx.",
  code: "FROM nginx:alpine\nCOPY index.html /usr/share/nginx/html/index.html\nEXPOSE 80",
},
{
  title: "Construir y ejecutar",
  detail: "Abre http://localhost:8082 para probar la lista.",
  code: "docker build -t tareas-app .\ndocker run -d -p 8082:80 --name tareas tareas-app",
},
{
  title: "Detener y limpiar",
  detail: "Limpia el contenedor cuando termines.",
  code: "docker stop tareas\ndocker rm tareas",
},
    ],
  },
};

const quiz = [
  {
    q: "¿Qué es una imagen de Docker?",
    a: ["Una plantilla para crear contenedores", "Una máquina virtual completa", "Un volumen de datos"],
    ok: 0,
  },
  {
    q: "¿Qué comando construye una imagen desde un Dockerfile?",
    a: ["docker build -t mi-app .", "docker ps -a", "docker logs mi-app"],
    ok: 0,
  },
  {
    q: "¿Para qué sirve un volumen?",
    a: ["Guardar datos persistentes", "Cambiar el kernel del host", "Publicar puertos automáticamente"],
    ok: 0,
  },
  {
    q: "¿Qué hace Docker Compose?",
    a: ["Orquesta varios servicios locales", "Reemplaza al sistema operativo", "Compila código JavaScript"],
    ok: 0,
  },
  {
    q: "Si aparece 'port is already allocated', ¿qué conviene revisar?",
    a: ["Que el puerto del host no esté ocupado", "Que el Dockerfile tenga un título", "Que la imagen sea de Alpine"],
    ok: 0,
  },
  {
    q: "¿Qué comando ayuda a ver redes creadas por Docker?",
    a: ["docker network ls", "docker stop network", "docker compose clean"],
    ok: 0,
  },
];

const storageKey = "dockerLabState";
const defaultState = {
  activeWindow: "fundamentos",
  opened: ["fundamentos"],
  recipe: "node",
  project: {
    active: "cv",
    done: {
      cv: [],
      menu: [],
      tasks: [],
    },
  },
  answers: [],
};

const readState = () => {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
  } catch {
    return JSON.parse(JSON.stringify(defaultState));
  }
};

const state = readState();
const validWindowIds = [...document.querySelectorAll(".window")].map((win) => win.id);
state.opened = Array.isArray(state.opened) ? state.opened.filter((id) => validWindowIds.includes(id)) : ["fundamentos"];
if (!state.opened.length) state.opened = ["fundamentos"];
state.project = {
  ...defaultState.project,
  ...(state.project || {}),
  done: {
    ...defaultState.project.done,
    ...((state.project && state.project.done) || {}),
  },
};
state.answers = Array.isArray(state.answers) ? state.answers : [];

const saveState = () => {
  localStorage.setItem(storageKey, JSON.stringify(state));
};

const makeText = (tag, className, text) => {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
};

const makeCopyButton = (value, label = "Copiar") => {
  const button = document.createElement("button");
  button.className = "copy rounded-md bg-white px-3 py-2 text-xs font-bold text-ocean ring-1 ring-slate-200";
  button.type = "button";
  button.dataset.copy = value;
  button.textContent = label;
  button.setAttribute("aria-label", `Copiar ${value.split("\n")[0]}`);
  return button;
};

const dockButtons = document.querySelectorAll(".dock-btn");
const windows = document.querySelectorAll(".window");
const progressCount = document.querySelector("#progressCount");
const opened = new Set(state.opened);

const updateProgress = () => {
  progressCount.textContent = `${Math.round((opened.size / windows.length) * 100)}%`;
};

const activateWindow = (target) => {
  windows.forEach((win) => {
    const isActive = win.id === target;
    win.classList.toggle("active", isActive);
    win.hidden = !isActive;
  });

  dockButtons.forEach((button) => {
    const isActive = button.dataset.window === target;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  opened.add(target);
  state.activeWindow = target;
  state.opened = [...opened];
  updateProgress();
  saveState();
};

dockButtons.forEach((button) => {
  button.addEventListener("click", () => activateWindow(button.dataset.window));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
    const current = [...dockButtons].indexOf(button);
    const next = dockButtons[(current + direction + dockButtons.length) % dockButtons.length];
    next.focus();
    activateWindow(next.dataset.window);
  });
});

activateWindow(document.querySelector(`#${state.activeWindow}`) ? state.activeWindow : "fundamentos");

const commandList = document.querySelector("#commandList");
const renderCommands = (filter = "") => {
  commandList.replaceChildren();
  const term = filter.trim().toLowerCase();

  commands
    .filter(([command, desc]) => `${command} ${desc}`.toLowerCase().includes(term))
    .forEach(([command, desc]) => {
      const row = document.createElement("article");
      row.className = "rounded-lg border border-slate-200 bg-slate-50 p-4";

      const layout = document.createElement("div");
      layout.className = "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between";

      const copy = makeCopyButton(command);
      const text = document.createElement("div");
      text.append(
        makeText("p", "font-mono text-sm font-bold text-ink", command),
        makeText("p", "mt-2 text-sm text-slate-600", desc),
      );

      layout.append(text, copy);
      row.append(layout);
      commandList.append(row);
    });

  if (!commandList.children.length) {
    commandList.append(makeText("p", "rounded-lg bg-slate-50 p-4 text-sm text-slate-600", "No hay comandos que coincidan con la búsqueda."));
  }
};

renderCommands();

document.querySelector("#commandSearch").addEventListener("input", (event) => {
  renderCommands(event.target.value);
});

document.addEventListener("click", async (event) => {
  const copyButton = event.target.closest(".copy");
  if (!copyButton) return;

  const target = copyButton.dataset.copyTarget;
  const value = target ? document.querySelector(`#${target}`)?.textContent : copyButton.dataset.copy;
  if (!value) return;

  copyButton.classList.remove("copied", "failed");
  try {
    await navigator.clipboard.writeText(value);
    copyButton.textContent = "Copiado";
    copyButton.classList.add("copied");
  } catch {
    copyButton.textContent = "Copia manual";
    copyButton.classList.add("failed");
  }
  setTimeout(() => {
    copyButton.textContent = "Copiar";
    copyButton.classList.remove("copied", "failed");
  }, 1200);
});

const recipeCode = document.querySelector("#recipeCode");
const setRecipe = (recipe) => {
  const selected = recipes[recipe] ? recipe : "node";
  recipeCode.textContent = recipes[selected];
  state.recipe = selected;

  document.querySelectorAll(".recipe-btn").forEach((button) => {
    const active = button.dataset.recipe === selected;
    button.className = active
      ? "recipe-btn w-full rounded-md bg-ocean px-4 py-3 text-left text-sm font-bold text-white"
      : "recipe-btn w-full rounded-md border border-slate-200 px-4 py-3 text-left text-sm font-bold";
    button.setAttribute("aria-pressed", String(active));
  });
  saveState();
};

document.querySelectorAll(".recipe-btn").forEach((button) => {
  button.type = "button";
  button.addEventListener("click", () => setRecipe(button.dataset.recipe));
});

setRecipe(state.recipe);

const projectCards = document.querySelector("#projectCards");
const projectSteps = document.querySelector("#projectSteps");
const projectTitle = document.querySelector("#projectTitle");
const projectPreview = document.querySelector("#projectPreview");
const projectOutcome = document.querySelector("#projectOutcome");
const projectState = {
  active: projects[state.project.active] ? state.project.active : "cv",
  done: Object.fromEntries(Object.keys(projects).map((key) => [key, new Set(state.project.done[key] || [])])),
};

const saveProjectState = () => {
  state.project.active = projectState.active;
  state.project.done = Object.fromEntries(Object.entries(projectState.done).map(([key, done]) => [key, [...done]]));
  saveState();
};

const renderProjectCards = () => {
  projectCards.replaceChildren();
  Object.entries(projects).forEach(([key, project]) => {
    const done = projectState.done[key].size;
    const percent = Math.round((done / project.steps.length) * 100);
    const button = document.createElement("button");
    button.className = `project-card ${projectState.active === key ? "active" : ""} rounded-lg border border-slate-200 bg-white p-4 text-left transition`;
    button.type = "button";
    button.setAttribute("aria-pressed", String(projectState.active === key));

    const bar = document.createElement("span");
    bar.className = "mt-4 block h-2 rounded-full bg-slate-100";
    const fill = document.createElement("span");
    fill.className = "block h-2 rounded-full bg-mint";
    fill.style.width = `${percent}%`;
    bar.append(fill);

    button.append(
      makeText("span", "text-xs font-bold uppercase tracking-wide text-ocean", project.level),
      makeText("span", "mt-2 block text-base font-black text-ink", project.title),
      makeText("span", "mt-1 block text-sm text-slate-600", project.tag),
      bar,
    );
    button.addEventListener("click", () => {
      projectState.active = key;
      saveProjectState();
      renderProjects();
    });
    projectCards.append(button);
  });
};

const updateProjectProgress = () => {
  const activeProject = projects[projectState.active];
  const done = projectState.done[projectState.active].size;
  const percent = Math.round((done / activeProject.steps.length) * 100);
  document.querySelector("#projectPercent").textContent = `${percent}%`;
  document.querySelector("#projectBar").style.width = `${percent}%`;
};

const renderProjectSteps = () => {
  const activeProject = projects[projectState.active];
  projectTitle.textContent = activeProject.title;
  projectPreview.innerHTML = activeProject.preview;
  projectOutcome.textContent = activeProject.outcome;
  projectSteps.replaceChildren();

  activeProject.steps.forEach((step, index) => {
    const checked = projectState.done[projectState.active].has(index);
    const item = document.createElement("article");
    item.className = `project-step ${checked ? "active" : ""} flex cursor-pointer gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4`;

    const label = document.createElement("label");
    label.className = "mt-1";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "project-check h-5 w-5 shrink-0 rounded border-slate-300 text-ocean focus:ring-ocean";
    check.dataset.step = String(index);
    check.checked = checked;
    label.append(check);

    const content = document.createElement("span");
    content.className = "min-w-0";
    content.append(
      makeText("span", "block text-sm font-black text-ink", `${index + 1}. ${step.title}`),
      makeText("span", "mt-2 block rounded-md bg-white px-3 py-2 text-sm leading-6 text-slate-700 ring-1 ring-slate-200", step.detail),
    );

    if (step.code) {
      const codeWrap = document.createElement("div");
      codeWrap.className = "mt-3 overflow-hidden rounded-lg bg-slate-950 ring-1 ring-slate-800";
      const copyRow = document.createElement("div");
      copyRow.className = "flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2";
      copyRow.append(makeText("span", "text-xs font-bold uppercase tracking-wide text-slate-400", "Copiar y pegar"), makeCopyButton(step.code));

      const pre = document.createElement("pre");
      pre.className = "max-h-72 overflow-auto p-3 text-xs leading-5 text-slate-100 sm:text-sm";
      const code = document.createElement("code");
      code.textContent = step.code;
      pre.append(code);
      codeWrap.append(copyRow, pre);
      content.append(codeWrap);
    }

    item.append(label, content);
    projectSteps.append(item);
  });

  document.querySelectorAll(".project-check").forEach((check) => {
    check.addEventListener("change", () => {
      const step = Number(check.dataset.step);
      if (check.checked) {
        projectState.done[projectState.active].add(step);
      } else {
        projectState.done[projectState.active].delete(step);
      }
      saveProjectState();
      renderProjects();
    });
  });
};

const renderProjects = () => {
  renderProjectCards();
  renderProjectSteps();
  updateProjectProgress();
};

document.querySelector("#resetProject").addEventListener("click", () => {
  projectState.done[projectState.active].clear();
  saveProjectState();
  renderProjects();
});

renderProjects();

const answers = new Map(state.answers.map((answer, index) => [index, answer]).filter(([, answer]) => Number.isInteger(answer)));
const quizList = document.querySelector("#quizList");
const saveAnswers = () => {
  state.answers = quiz.map((_, index) => answers.get(index) ?? null);
  saveState();
};

const renderQuiz = () => {
  quizList.replaceChildren();
  quiz.forEach((item, questionIndex) => {
    const card = document.createElement("article");
    card.className = "rounded-lg border border-slate-200 bg-slate-50 p-4";
    card.append(makeText("p", "font-black text-ink", `${questionIndex + 1}. ${item.q}`));

    const options = document.createElement("div");
    options.className = "mt-3 grid gap-2";
    item.a.forEach((answer, answerIndex) => {
      const button = document.createElement("button");
      const chosen = answers.get(questionIndex) === answerIndex;
      const isCorrect = chosen && item.ok === answerIndex;
      const isWrong = chosen && item.ok !== answerIndex;
      button.type = "button";
      button.className = `rounded-md px-3 py-2 text-left text-sm font-bold ring-1 ${
        isCorrect
          ? "bg-emerald-100 text-emerald-800 ring-emerald-300"
          : isWrong
            ? "bg-red-100 text-red-800 ring-red-300"
            : "bg-white text-slate-700 ring-slate-200"
      }`;
      button.textContent = answer;
      button.setAttribute("aria-pressed", String(chosen));
      button.addEventListener("click", () => {
        answers.set(questionIndex, answerIndex);
        saveAnswers();
        renderQuiz();
        updateScore();
      });
      options.append(button);
    });
    card.append(options);
    quizList.append(card);
  });
};

const updateScore = () => {
  const correct = quiz.filter((item, index) => answers.get(index) === item.ok).length;
  document.querySelector("#score").textContent = `${correct}/${quiz.length}`;
  document.querySelector("#scoreText").textContent =
    correct === quiz.length ? "Dominio sólido de los conceptos iniciales." : "Revisa las ventanas anteriores y vuelve a intentar.";
};

document.querySelector("#resetQuiz").addEventListener("click", () => {
  answers.clear();
  saveAnswers();
  renderQuiz();
  updateScore();
});

renderQuiz();
updateScore();
