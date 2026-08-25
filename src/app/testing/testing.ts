/**
 * Infraestructura comun de los specs de humo.
 *
 * Los componentes de la app viven dentro de modulos que les dan router,
 * HttpClient, toastr, traduccion, ng-bootstrap y el saco de servicios de
 * CoreModule. Los specs generados por el CLI los crean sueltos con
 * `declarations: [X]`, asi que aqui se repone eso; sin ello revientan en el
 * constructor (NG0201), en la plantilla (NG0302 / NG0301) o al desreferenciar
 * el usuario de sesion.
 */
import { EnvironmentProviders, Injectable, Provider, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideTranslateService, TranslateNoOpLoader, TranslatePipe } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from '@app/core/core.module';
import { TicketHubService } from '@app/core/service/ticket-service/ticket-hub.service';

/**
 * TicketHubService abre un WebSocket de SignalR contra produccion desde su
 * propio constructor. En pruebas se hereda solo para anular esa llamada; el
 * resto del servicio queda igual.
 */
@Injectable()
export class TicketHubServiceStub extends TicketHubService {
  override async startConnection(): Promise<void> {
    // sin red en pruebas
  }
}

export const testProviders: (Provider | EnvironmentProviders)[] = [
  // CoreModule va PRIMERO a proposito: es EnvironmentProviders y, si se pone
  // detras de provideHttpClientTesting(), Angular reordena y vuelve a ganar el
  // HttpXhrBackend real, con lo que los specs salen a la API de produccion.
  // CoreModule no usa providedIn:'root'; declara sus ~60 servicios en el
  // NgModule, asi que se reponen en bloque en vez de uno a uno.
  importProvidersFrom(CoreModule),
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([]),
  provideNoopAnimations(),
  provideToastr(),
  // Sin loader real: los specs no comprueban traducciones, solo necesitan que
  // el pipe resuelva.
  provideTranslateService({ loader: TranslateNoOpLoader, fallbackLang: 'en' }),
  { provide: TicketHubService, useClass: TicketHubServiceStub },
];

export const testImports = [TranslatePipe, NgbModule];

/** Usuario de sesion que AuthService lee de localStorage al construirse. */
export const testAffiliate = {
  id: 1,
  user_name: 'test',
  email: 'test@example.com',
  image_profile_url: '',
  token: '',
};

/**
 * Muchos componentes asumen sesion iniciada y desreferencian el usuario en
 * ngOnInit o en la plantilla. Se siembra antes de cada spec desde `test.ts`.
 */
export function seedTestSession(): void {
  localStorage.setItem('currentUserAffiliate', JSON.stringify(testAffiliate));
  localStorage.setItem('currentUserAdmin', JSON.stringify(testAffiliate));
}
