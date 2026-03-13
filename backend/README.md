# Backend — NestJS + MySQL

## Requisitos

- MySQL 8+
- Node 20+

## Base de datos

```sql
CREATE DATABASE pokemon_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Variables de entorno

Copia `env.template` a `.env` y ajusta.

| Variable | Ejemplo | Descripción |
|----------|---------|-------------|
| DB_HOST | localhost | |
| DB_PORT | 3306 | |
| DB_USER | root | |
| DB_PASSWORD | | |
| DB_NAME | pokemon_app | |
| DB_SYNC | true | `false` en producción (usar migraciones) |
| JWT_SECRET | (fuerte) | Obligatorio en prod |
| JWT_EXPIRES | 7d | |
| PORT | 3000 | |
| CORS_ORIGIN | http://localhost:5173 | Origen del front |

## API (Prueba técnica)

| Método | Ruta | Auth |
|--------|------|------|
| POST | `/auth/register` | no — body `{ "email", "password" }` |
| POST | `/auth/login` | no — `{ "access_token" }` |
| GET | `/pokemon?page=0&limit=20` | Bearer JWT |
| GET | `/pokemon/:id` | UUID del favorito |
| POST | `/pokemon` | `{ "pokeapiId": 25, "notes"?: "..." }` |
| PUT | `/pokemon/:id` | `{ "notes": "..." }` |
| DELETE | `/pokemon/:id` | |
| GET | `/pokeapi/catalog?page=0` | no — listado PokeAPI, 20 ítems |
| GET | `/pokeapi/pokemon/:idOrName` | no — caché id/nombre |

## Arranque

```bash
npm install
npm run start:dev
```
