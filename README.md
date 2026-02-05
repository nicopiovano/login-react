# 🖥️ Login — Frontend (React SPA)

Aplicación de **login y registro** que consume la API del backend (Laravel + Sanctum). Desarrollada con **React 19**, **Vite** y **Tailwind CSS**.

---

## 🛠 Stack

| Tecnología | Uso |
|------------|-----|
| **React 19** | UI |
| **Vite** | Build y dev server |
| **React Router** | Rutas (login, registro, dashboard) |
| **Zustand** | Estado global (auth) |
| **Axios** | Peticiones HTTP con cookies |
| **Tailwind CSS** | Estilos |

---

## 📋 Requisitos

- **Node.js** 18+ (recomendado 20+)
- **npm** o **pnpm**
- Backend de login corriendo (ver [login/backend/README.md](../backend/README.md))

---

## 🚀 Cómo levantar el proyecto

### 1. Asegúrate de que el backend esté corriendo

- Con Docker: `cd login && docker compose up -d` → API en **http://localhost:8001**
- O en local: `cd login/backend && php artisan serve --port=8001`

### 2. Instalar dependencias

```bash
cd login/frontend
npm install
```

### 3. Modo desarrollo

```bash
npm run dev
```

La app estará en **http://localhost:5173**.

El frontend ya está configurado para usar la API en **http://localhost:8001** por defecto.

### 4. Cambiar la URL de la API (opcional)

Crea un `.env` en `login/frontend`:

```env
VITE_API_URL=http://localhost:8001
```

Si usas otro puerto o dominio, cambia esta variable y reinicia `npm run dev`.

---

## 📁 Estructura principal

```
frontend/
├── src/
│   ├── main.jsx           # Entrada
│   ├── App.jsx            # Rutas y layout
│   ├── lib/
│   │   └── api.js         # Cliente Axios (baseURL, cookies, CSRF)
│   ├── stores/
│   │   └── auth.js        # Estado de autenticación (Zustand)
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   └── components/
│       ├── ProtectedRoute.jsx
│       └── ui.jsx
├── index.html
└── vite.config.js
```

---

## 🔐 Flujo de autenticación

1. **Login / Register:** el usuario envía credenciales a la API.
2. La API devuelve cookies de sesión (Sanctum).
3. El frontend envía esas cookies en cada petición (`withCredentials: true`).
4. Las rutas protegidas (ej. Dashboard) se controlan con `ProtectedRoute` y el store de auth.

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build para producción |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | Ejecuta ESLint |

---

## 💡 Notas

- El backend debe tener **CORS** y **Sanctum** configurados para `localhost:5173` (o el origen que uses).
- Si cambias el puerto del backend, actualiza `VITE_API_URL` en `.env`.
- La API usa cookies para la sesión; no hace falta guardar el token manualmente en el frontend si usas la config actual de Axios.
