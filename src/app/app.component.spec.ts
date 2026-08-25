import { TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { testProviders } from '@app/testing/testing';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // La plantilla solo monta <app-page-loader> y <router-outlet>; no hace
      // falta declararlos para comprobar que el componente arranca.
      schemas: [NO_ERRORS_SCHEMA],
      providers: [...testProviders],
      declarations: [AppComponent]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
