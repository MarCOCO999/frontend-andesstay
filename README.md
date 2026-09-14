# frontend-andesstay

Frontend Angular del proyecto **AndesStay** (caso DSY1107 – Desarrollo Cloud Native I, Duoc UC): la aplicación que usan huéspedes, operadores, auditores y administradores para reservar, gestionar el catálogo y revisar KPIs/auditoría.

## Rol en la arquitectura

```
Angular (MSAL, este repo) → AWS API Gateway → ms-andesstay-bff → microservicios de dominio
```

Nunca llama directo a los microservicios de dominio (`reservations`, `catalog`, `audit`, `report`): todo pasa por `ms-andesstay-bff`, que a su vez está detrás de AWS API Gateway.

## Autenticación y roles

- Login con **MSAL** (`@azure/msal-angular` + `@azure/msal-browser`) contra Azure AD, usando el flujo de redirección.
- Los **App Roles** de Azure AD (`Admin`, `Operador`, `Cliente`, `Auditor`) vienen en el claim `roles` del ID token y se usan para:
  - Restringir la navegación con un route guard funcional (`roleGuard`), que redirige a `/dashboard` con un mensaje de "acceso denegado" si el rol no alcanza.
  - Mostrar u ocultar acciones dentro de cada pantalla (p. ej. solo Admin puede crear/editar unidades del catálogo).
- Un interceptor global captura los `401` del backend (token vencido o revocado), cierra la sesión de MSAL localmente y redirige a `/login` con un aviso.

## Pantallas principales

| Ruta | Roles | Descripción |
|---|---|---|
| `/dashboard` | todos | Para Admin/Operador: resumen de reservas por estado (+ KPIs para Admin). Para Cliente: historial de sus reservas |
| `/reservations` | Cliente, Operador, Admin | Selector visual de unidades disponibles, creación de reservas con monto estimado y forma de pago |
| `/reservations/:id` | Cliente, Operador, Admin | Detalle de una reserva, cambio de estado y acceso al pago |
| `/reservations/:id/pay` | Cliente, Operador, Admin | Pasarela de pago simulada (sin procesador real) |
| `/catalog` | Operador, Admin | Gestión de unidades: tarifa, disponibilidad, amenities y foto de referencia (subida directo a S3) |
| `/reports` | Admin | KPIs de negocio |
| `/audit` | Admin, Auditor | Línea de tiempo de eventos por reserva |

## Stack

- Angular 19 (standalone components, *lazy loading* por ruta)
- `@azure/msal-angular` / `@azure/msal-browser` para autenticación
- Diseño propio en tonos tierra (Fraunces + Inter), sin dependencia de ningún framework de UI

## Configuración

Los valores de Azure AD, el scope de la API y la URL del BFF viven en `src/environments/`:

- `environment.ts`: valores de desarrollo (`bffUrl: http://localhost:8081`).
- `environment.production.ts`: valores de producción (URL del API Gateway de AWS). Angular hace el *swap* automático al compilar con `--configuration production` (ver `angular.json`).

## Cómo ejecutarlo en local

Requiere Node 22 y el BFF (`ms-andesstay-bff`) corriendo en `http://localhost:8081`.

```bash
npm install
npm start        # ng serve, http://localhost:4200
npm run build    # build de producción
```

## Repos relacionados

[ms-andesstay-bff](https://github.com/MarCOCO999/ms-andesstay-bff) · [ms-andesstay-reservations](https://github.com/MarCOCO999/ms-andesstay-reservations) · [ms-andesstay-catalog](https://github.com/MarCOCO999/ms-andesstay-catalog) · [ms-andesstay-notify](https://github.com/MarCOCO999/ms-andesstay-notify) · [ms-andesstay-audit](https://github.com/MarCOCO999/ms-andesstay-audit) · [ms-andesstay-report](https://github.com/MarCOCO999/ms-andesstay-report) · [andesstay-infra](https://github.com/MarCOCO999/andesstay-infra)
