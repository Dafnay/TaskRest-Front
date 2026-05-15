# TaskRest Front — Frontend React

Aplicación web desarrollada con **React 19** y **Vite** que consume la API REST [todo-rest](https://github.com) para la gestión de tareas. Permite a los usuarios crear, editar, filtrar y eliminar tareas, gestionar etiquetas y categorías, y consultar estadísticas desde un dashboard interactivo.

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2.4 | Librería principal de UI |
| React Router DOM | 7.14.1 | Gestión de rutas y navegación |
| Vite | 8.0.4 | Bundler y servidor de desarrollo |
| Bootstrap | 5.3.8 | Estilos y componentes visuales |
| Bootstrap Icons | 1.13.1 | Iconografía |
| Recharts | 3.8.1 | Gráficos del dashboard |

---

## Requisitos

- Node.js 18+
- npm
- API REST [todo-rest](https://github.com) en ejecución en `http://localhost:8080`

---

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

La aplicación se levanta en `http://localhost:5173`.

---

## Build de producción

```bash
npm run build
```

Los ficheros estáticos se generan en la carpeta `dist/`.

---

## Estructura del proyecto

```
src/
├── pages/          # Páginas principales (Login, Tareas, Dashboard...)
├── components/     # Componentes reutilizables
├── routes/         # Configuración de rutas y protección por rol
├── layout/         # Layout compartido con sidebar responsive
└── services/       # Llamadas HTTP a la API REST
```

---

## Roles y acceso

| Rol | Páginas accesibles |
|---|---|
| Público | `/login`, `/register` |
| USER / GESTOR | `/dashboard`, `/tasks`, `/tags`, `/categories`, `/profile` |
| ADMIN | `/users`, `/categories`, `/profile` |

---

## Conexión con la API

La aplicación usa **HTTP Basic Auth** para autenticarse. Las credenciales se envían en la cabecera `Authorization` en cada petición a la API.

Para cambiar la URL base de la API, modifica la constante correspondiente en la carpeta `services/`.

---

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin | ADMIN |
| user1 | 12345 | USER |
| user2 | 12345 | USER |

> Los usuarios se crean automáticamente al arrancar el backend por primera vez.

---

## Despliegue con Docker

El frontend está preparado para desplegarse como contenedor Docker junto al backend y la base de datos mediante Docker Compose.

```bash
docker-compose up -d
```
