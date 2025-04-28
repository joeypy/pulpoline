# 🌦️ Pulpo Line Weather App

Aplicación fullstack desarrollada como prueba técnica. Permite consultar el clima de distintas ciudades, realizar búsquedas autocompletadas, marcar ciudades como favoritas y persistirlas en una base de datos.

---

## 🚀 Tecnologías principales

- **Frontend:** React + Vite + TypeScript
- **Backend:** NestJS + TypeScript
- **Base de Datos:** PostgreSQL
- **Cache:** Redis
- **Dockerizado:** Multicontenedor con Docker Compose

---

## 🌟 Funcionalidades principales

- **Búsqueda de ciudades** con **autocompletado** mientras se escribe.
- **Consulta de clima** actual (Celsius, Fahrenheit, viento, humedad, hora local).
- **Historial local** de búsquedas (localStorage).
- **Marcado de favoritos** persistente en base de datos.
- **Vista de tabla** de ciudades.
- **Vista detallada** de información meteorológica.
- **Cache de resultados** usando Redis para optimizar rendimiento.
- **Manejo robusto de errores**.
- **Dockerización completa** (multi-container).

---

## 🧹 Estructura del proyecto

```
/pulpo_line
  ├── backend/      # API NestJS
  ├── frontend/     # Aplicación React
  ├── docker-compose.yml
  ├── Makefile
  └── .env
```

---

## ⚙️ Configuración de entorno

### Variables necesarias en `/pulpo_line/.env`

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=weather
DB_PORT=5432
WEATHER_API_KEY=tu_api_key_real
REDIS_HOST=redis
REDIS_PORT=6379
```

**Notas:**

- El backend (NestJS) también puede usar su propio `.env` en `/backend/.env` si se corre localmente.
- El frontend (React) puede tener variables como `VITE_BACKEND_URL` si se quiere más configuración.

---

## 📦 Instalación manual (sin Docker)

### 1. Levantar la base de datos PostgreSQL local

Instala y corre PostgreSQL en tu máquina.

### 2. Backend

```bash
cd backend
npm install
npm run start:dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Instalación usando Docker (recomendado)

Desde `/pulpo_line`:

### 1. Levantar todo

```bash
docker-compose up --build
```

### 2. Acceso

|  Servicio   |          URL          |
| :---------: | :-------------------: |
|  Frontend   | http://localhost:3001 |
| Backend API | http://localhost:3000 |

---

## ⚡ Uso del Makefile (opcional)

Desde `/pulpo_line`:

|    Comando     |                   Acción                   |
| :------------: | :----------------------------------------: |
|   `make up`    |        Levanta todos los servicios         |
|  `make down`   |   Detiene y elimina todos los servicios    |
|  `make logs`   | Muestra los logs de todos los contenedores |
| `make restart` | Reconstruye y levanta todos los servicios  |

Ejemplo:

```bash
make up
make logs
make down
```

---

## 📚 Endpoints del Backend

|  Método  |              Endpoint               |                       Descripción                        |
| :------: | :---------------------------------: | :------------------------------------------------------: |
|  `GET`   |    `/weather?city=NombreCiudad`     |                   Obtiene clima actual                   |
|  `GET`   | `/weather/autocomplete?query=Texto` |          Autocompletado de nombres de ciudades           |
|  `GET`   |            `/favorites`             |               Lista de ciudades favoritas                |
|  `POST`  |            `/favorites`             | Agrega ciudad a favoritos (`{ "city": "NombreCiudad" }`) |
| `DELETE` |         `/favorites/:city`          |               Elimina ciudad de favoritos                |

---

## 🧪 Pruebas unitarias

- **Backend:**
  - Servicios `WeatherService` y `FavoritesService` testeados.
  - Mocks de Redis y base de datos.
- **Frontend:**
  - (Opcional) Test de componentes y hooks si se desea expandir.

Ejecutar en backend:

```bash
npm run test
```

---

## 📊 Decisiones técnicas

- **NestJS:** Modularidad, manejo robusto de errores, DTOs y validaciones automáticas.
- **React + Vite:** Velocidad de desarrollo y optimización frontend.
- **Redis:** Cache in-memory para disminuir latencia en autocomplete y datos de clima.
- **Docker:** Entorno portable, fácil de levantar en cualquier máquina.
- **Makefile:** Mejora de experiencia de desarrollo.

---

## 🚀 Notas finales

- Aplicación preparada para escalar (p.ej: migrar Redis y PostgreSQL a servicios cloud).
- Código limpio, estructurado y comentado.
- Diseño pensado en buenas prácticas de arquitectura y separación de responsabilidades.

---

## 📬 Autor

- **Nombre:** Joseph Boscán
- **Email:** [josephboscan.job@gmail.com](mailto:josephboscan.job@gmail.com)
  Desarrollado como parte de la prueba técnica Fullstack Node.js (React · React Native · NestJS · Express · TypeScript · Docker).

---
