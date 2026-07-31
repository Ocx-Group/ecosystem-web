# Angularlight

## Alcance del producto

`web` (Ecosystem) es una de las tres webs activas del sistema. Conserva sus
vistas, funciones y dashboard administrativo propios.

Decisión vigente desde el 2026-07-31:

- no se crearán nuevas webs ni un frontend único;
- este dashboard administrará los detalles de su propia marca;
- el branding publicado seguirá teniendo a `ConfigurationService` como fuente
  central;
- el navegador nunca debe escribir directamente en la base de datos ni confiar
  en un `BrandId` para autorizar cambios.

Implementación administrativa local:

- `Administración > Configuración > Identidad de marca` permite consultar,
  previsualizar y guardar nombre, empresa, dominio, soporte, logo y colores;
- las llamadas usan exclusivamente el JWT del administrador para
  `brandconfiguration/admin/current`; no se habilitó un interceptor JWT global;
- el backend deriva la marca desde el token firmado y el request no contiene
  `BrandId`;
- el guardado actual publica inmediatamente. Borradores, carga de archivos y
  rollback todavía no forman parte de la interfaz;
- después de desplegar el backend, una sesión administrativa antigua debe
  cerrarse e iniciarse nuevamente para recibir el JWT.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
