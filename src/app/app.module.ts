
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from '@app/shared/perfect-scrollbar.module';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { firebaseConfig } from '@environments/environment';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { HeaderComponent } from './layout/header/header.component';
import { HeaderAdminComponent } from './layout/header-admin/header-admin.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SidebarAdminComponent } from './layout/sidebar-admin/sidebar-admin.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layout/app-layout/admin-layout/admin-layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LogoComponent } from './layout/logo/logo.component';
import { ClientModule } from './client/client.module';
import { MembershipManagerModule } from "./client/membership-manager/membership-manager.module";
import { TermsConditionsModalComponent } from './layout/terms-conditions-modal/terms-conditions-modal.component';
import { ImageProfileModalComponent } from './shared/components/image-profile-modal/image-profile-modal.component';
import { BrandingService } from './core/service/branding-service/branding.service';
import { RuntimeTenantInterceptor } from './core/interceptor/runtime-tenant.interceptor';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: false,
};

export function initializeBranding(brandingService: BrandingService): () => Promise<void> {
  return () => brandingService.load();
}

@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
        HeaderAdminComponent,
        PageLoaderComponent,
        SidebarComponent,
        SidebarAdminComponent,
        RightSidebarComponent,
        AuthLayoutComponent,
        MainLayoutComponent,
        AdminLayoutComponent,
        FooterComponent,
        LogoComponent,
        TermsConditionsModalComponent
    ],
    exports: [LogoComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        LoadingBarRouterModule,
        TranslatePipe,
        // core & shared
        CoreModule,
        ToastrModule.forRoot(),
        SharedModule,
        NgbModule,
        ClipboardModule,
        MembershipManagerModule,
        ClientModule,
        NgxDropzoneModule,
        ImageProfileModalComponent], providers: [
        provideTranslateService({
            loader: provideTranslateHttpLoader({ prefix: 'assets/i18n/', suffix: '.json' }),
        }),
        // @angular/fire 20 devuelve EnvironmentProviders: va en providers, no en imports
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RuntimeTenantInterceptor,
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeBranding,
            deps: [BrandingService],
            multi: true,
        },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
