# CCPay Engine

API para gestionar recargas de wallets de criptomonedas (USDC y COPW) con conversión de monedas fiat.

## 🚀 Quick Start (Para Examinadores)

Si solo quieres ejecutar el proyecto rápidamente:

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar base de datos
docker-compose up -d

# 3. Generar cliente de Prisma
pnpm prisma:generate

# 4. Aplicar migraciones
pnpm prisma migrate deploy

# 5. Cargar datos iniciales
pnpm prisma:seed

# 6. Iniciar aplicación
pnpm start:dev
```

La aplicación estará disponible en `http://localhost:3000` y la documentación Swagger en `http://localhost:3000/api`

**⚠️ Importante:** Después del paso 5, copia los UUIDs de los usuarios que se muestran en consola y actualízalos en `api.http` si quieres usar ese archivo para pruebas.

---

##  Inicio Rápido

### 1. Requisitos previos

- Node.js 18+
- Docker y Docker Compose
- pnpm (o npm/yarn)
- Prisma 6.19.0 (se instalará automáticamente con `pnpm install`)

### 2. Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd ccpay-engine

# Instalar dependencias
pnpm install
```

### 3. Configurar variables de entorno

he dejado el archivo .env para que no se tenga que configurar cada que se descarga.

### 4. Levantar la base de datos

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d

# Verificar que esté corriendo
docker-compose ps
```

### 5. Ejecutar migraciones

```bash
# Generar el cliente de Prisma
pnpm prisma generate

# Aplicar migraciones
pnpm prisma migrate deploy
```

### 6. Cargar datos iniciales (seed)

```bash
pnpm prisma:seed
```

Esto crea dos usuarios de prueba:
- **Admin**: ID será mostrado en consola, email: `admin@test.com`
- **Read-Only**: ID será mostrado en consola, email: `readonly@test.com`

**⚠️ Importante:** Copia los UUIDs que se muestran en consola y actualízalos en `api.http` si quieres usar ese archivo para pruebas.

### 7. Iniciar la aplicación

```bash
pnpm start:dev

```

La aplicación estará disponible en `http://localhost:3000`

---

## Documentación API (Swagger)

Una vez iniciada la app, accede a:

```
http://localhost:3000/api
```

---

## 🧪 Ejecutar Tests

```bash
# Todos los tests
pnpm test

# Tests en modo watch
pnpm test:watch

# Cobertura
pnpm test:cov
```

---

## Endpoints

### POST /recharges
Crear una recarga (requiere rol **ADMIN**)

```json
{
  "userId": "00000000-0000-0000-0000-000000000001",
  "walletType": "USDC",
  "fiatAmount": 100,
  "fiatCurrency": "USD",
  "transactionType": "BANK_TRANSFER"
}
```

### GET /recharges
Listar recargas (requiere rol **ADMIN** o **READ_ONLY**)

```bash
# Todas las recargas del sistema (útil para auditoría con READ_ONLY)
GET /recharges

# Recargas de un usuario específico
GET /recharges?userId=<user-id>
```

---

## Tipos de Wallet

- **USDC**: Stablecoin anclada al dólar (USD)
- **COPW**: Stablecoin anclada al peso colombiano (COP)

## 💵 Monedas Fiat Soportadas

- **USD**: Dólar estadounidense (tasa: 1.0)
- **CHF**: Franco suizo (tasa: 0.92)
- **COP**: Peso colombiano (tasa: 0.00025)

## 💳 Tipos de Transacción y Costos

| Tipo | Costo Fijo | Costo Porcentual |
|------|------------|------------------|
| `BANK_TRANSFER` | $0 | 1% |
| `NATIONAL_ATM` | $2.5 | 0% |
| `INTERNATIONAL_ATM` | $5 | 2% |

---

## Estructura del Proyecto

```
src/
├── domain/              # Lógica de negocio
│   ├── entities/        # Entidades del dominio
│   ├── repository/      # Interfaces de repositorios
│   ├── services/        # Servicios de dominio (conversión, costos)
│   └── use-case/        # Casos de uso
├── application/         # Módulos de aplicación
├── infrastructure/      # Capa de infraestructura
│   ├── api/            # Controllers y DTOs
│   └── database/       # Prisma y repositorios
└── test/               # Tests unitarios
    └── domain/
        ├── services/   # Tests de servicios
        └── use-case/   # Tests de use cases
```

---

## Tecnologías

- **NestJS** 11.x: Framework backend
- **Prisma** 6.19.0: ORM para PostgreSQL
  - `@prisma/client`: 6.19.0
  - `prisma` CLI: 6.19.0
- **PostgreSQL** 16: Base de datos
- **Docker**: Contenedorización
- **Jest** 30.x: Testing
- **Swagger** (OpenAPI): Documentación API
- **TypeScript** 5.7.x: Lenguaje

---

## Comandos Útiles

```bash
# Limpiar y reiniciar BD
docker-compose down -v
docker-compose up -d
pnpm prisma:generate
pnpm prisma migrate deploy
pnpm prisma:seed

# Ver logs de la BD
docker-compose logs -f postgres

# Formatear código
pnpm format

# Linter
pnpm lint
```

---

## Archivo de Pruebas HTTP

El archivo `api.http` contiene 28 peticiones de ejemplo para probar todos los endpoints. Puedes usarlo con la extensión **REST Client** de VS Code.

**Antes de usar:** Actualiza las variables `@adminUserId` y `@readOnlyUserId` con los UUIDs que se mostraron al ejecutar el seed.

---

## Roles y Permisos

| Rol | Crear Recargas | Listar Recargas |
|-----|----------------|-----------------|
| `ADMIN` | ✅ (para cualquier usuario) | ✅ (todas o filtradas) |
| `READ_ONLY` | ❌ | ✅ (todas o filtradas - rol de auditoría) |

**Nota:** El rol `READ_ONLY` puede ver todas las recargas del sistema sin filtro, lo que lo convierte en un rol de auditoría ideal.

---

## Tests

El proyecto incluye **31 tests unitarios**:

- ✅ 10 tests: `ExchangeRateService`
- ✅ 13 tests: `TransactionCostService`
- ✅ 4 tests: `CreateRechargeUseCase`
- ✅ 4 tests: `ListRechargesUseCase`

---

## Troubleshooting

### Error: "Can't reach database server"
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Reiniciar contenedor
docker-compose restart postgres
```

### Error: "Authentication failed"
```bash
# Verificar DATABASE_URL en .env
# Asegurarse que el puerto sea 5433 (no 5432)
```

### Error con Prisma Client
```bash
# Si hay problemas con el cliente de Prisma, regenerar
pnpm prisma:generate

# Si persiste, limpiar y reinstalar
rm -rf node_modules
pnpm install
pnpm prisma:generate
pnpm prisma migrate deploy
pnpm prisma:seed
```

### Nota sobre versiones de Prisma
Este proyecto usa **Prisma 6.19.0** específicamente. Si experimentas problemas de compatibilidad:
- Verifica que tanto `@prisma/client` como `prisma` estén en la misma versión (6.19.0)
- No actualices Prisma sin probar todas las funcionalidades
