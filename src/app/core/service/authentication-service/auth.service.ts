import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Signin } from '@app/core/models/signin-model/signin.model';
import { User } from '@app/core/models/user-model/user.model';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { environment } from '@environments/environment';
import { Response } from '@app/core/models/response-model/response.model';
import { ToastrService } from 'ngx-toastr';


import { CartService } from '../cart.service/cart.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: environment.tokens.accountService.toString(),
    'X-Client-ID': environment.tokens.clientID.toString()
  }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserAffiliateSubject: BehaviorSubject<UserAffiliate>;
  public currentUserAffiliate: Observable<UserAffiliate>;

  private currentUserAdminSubject: BehaviorSubject<User>;
  public currentUserAdmin: Observable<User>;
  private urlApi: string;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cartService: CartService,

  ) {
    this.currentUserAffiliateSubject = new BehaviorSubject<UserAffiliate>(
      JSON.parse(localStorage.getItem('currentUserAffiliate'))
    );
    this.currentUserAdminSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUserAdmin'))
    );
    this.currentUserAffiliate = this.currentUserAffiliateSubject.asObservable();
    this.currentUserAdmin = this.currentUserAdminSubject.asObservable();
    this.urlApi = environment.apis.accountService;
  }

  public get currentUserAffiliateValue(): UserAffiliate {
    return this.currentUserAffiliateSubject.value;
  }

  public get currentUserAdminValue(): User {
    return this.currentUserAdminSubject.value;
  }

  loginUser(userCredentials: Signin) {
    return this.http
      .post<Response>(
        this.urlApi.concat('/auth/login'),
        userCredentials,
        httpOptions
      )
      .pipe(
        map((response: Response) => {
          if (response.success) {
            this.valiteUserType(response);
          }
          return response;
        })
      );
  }

  loginWithGoogle(request: {
    referralUserName?: string;
    country?: number;
    phone?: string;
    termsConditions?: boolean;
    browserInfo?: string;
    operatingSystem?: string;
    ipAddress?: string;
  }) {
    return from(this.requestGoogleIdToken()).pipe(
      switchMap(idToken =>
        this.http.post<Response>(
          this.urlApi.concat('/auth/google'),
          {
            idToken,
            referralUserName: request.referralUserName,
            country: request.country,
            phone: request.phone,
            termsConditions: request.termsConditions ?? false,
            browserInfo: request.browserInfo,
            operatingSystem: request.operatingSystem,
            ipAddress: request.ipAddress,
          },
          httpOptions
        )
      ),
      map((response: Response) => {
        if (response.success) {
          this.valiteUserType(response);
        }
        return response;
      })
    );
  }

  private googleIdentityScriptPromise?: Promise<void>;

  private loadGoogleIdentityScript(): Promise<void> {
    const googleIdentity = (globalThis as any).google?.accounts?.id;
    if (googleIdentity) {
      return Promise.resolve();
    }

    if (this.googleIdentityScriptPromise) {
      return this.googleIdentityScriptPromise;
    }

    this.googleIdentityScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar Google Identity Services.'));
      document.head.appendChild(script);
    });

    return this.googleIdentityScriptPromise;
  }

  private async requestGoogleIdToken(): Promise<string> {
    const clientId = environment.googleAuth?.clientId;
    if (!clientId) {
      throw new Error('Google OAuth Client ID no configurado.');
    }

    await this.loadGoogleIdentityScript();
    const googleIdentity = (globalThis as any).google?.accounts?.id;
    if (!googleIdentity) {
      throw new Error('Google Identity Services no está disponible.');
    }

    return new Promise<string>((resolve, reject) => {
      const overlay = this.createGoogleSignInOverlay();
      const buttonHost = overlay.querySelector('[data-google-button]');
      const closeButton = overlay.querySelector('[data-google-close]');

      const cleanup = () => {
        googleIdentity.cancel?.();
        overlay.remove();
      };

      closeButton?.addEventListener('click', () => {
        cleanup();
        reject(new Error('Inicio de sesión con Google cancelado.'));
      });

      googleIdentity.initialize({
        client_id: clientId,
        auto_select: false,
        cancel_on_tap_outside: true,
        callback: (response: { credential?: string }) => {
          if (!response.credential) {
            cleanup();
            reject(new Error('No se pudo obtener el token de Google.'));
            return;
          }

          const credential = response.credential;
          cleanup();
          resolve(credential);
        },
      });

      googleIdentity.renderButton(buttonHost, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'continue_with',
        locale: 'es',
        width: 280,
      });
    });
  }

  private createGoogleSignInOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '2147483647';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(15, 23, 42, 0.55)';

    overlay.innerHTML = `
      <div style="width: min(360px, calc(100vw - 32px)); background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 24px 64px rgba(15, 23, 42, 0.28); text-align: center;">
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 18px; font-weight: 600;">Continuar con Google</h2>
        <div data-google-button style="display: flex; justify-content: center; min-height: 44px;"></div>
        <button data-google-close type="button" style="margin-top: 16px; border: 0; background: transparent; color: #475569; cursor: pointer; font-size: 14px;">Cancelar</button>
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  valiteUserType(response: Response) {
    let isUserAffiliate = response.data.is_affiliate;
    if (isUserAffiliate) {
      this.setUserAffiliateValue(response.data);
    } else {
      this.setUserAdminValue(response.data);
    }
  }

  UserAffiliateEmailConfirmation(userName: string) {
    console.log(httpOptions);
    return this.http
      .put(
        this.urlApi.concat('/useraffiliateinfo/email_confirmation/', userName),
        {},
        httpOptions
      )
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  logoutUser() {
    this.cartService.removeAllCart();
    localStorage.removeItem('currentUserAdmin');
    localStorage.removeItem('currentUserAffiliate');
    this.currentUserAffiliateSubject.next(null);
    this.currentUserAdminSubject.next(null);

    this.toastr.clear();

    return of({ success: false });
  }

  public setUserAffiliateValue(user: UserAffiliate) {
    localStorage.setItem('currentUserAffiliate', JSON.stringify(user));
    this.currentUserAffiliateSubject.next(user);
  }

  public setUserAdminValue(user: User) {
    localStorage.setItem('currentUserAdmin', JSON.stringify(user));
    this.currentUserAdminSubject.next(user);
  }

  getLoginMovementsByAffiliatedId(affiliateId: number) {
    return this.http
      .get<Response>(
        `${this.urlApi}/auth/login_movements/${affiliateId}`,
        httpOptions
      )
      .pipe(
        map((response) => {

          return response.data;
        })
      );
  }

  fetchIpAddress(): Observable<string> {
    return this.http
      .get<{ ip: string }>('https://api.ipify.org?format=json')
      .pipe(map((data) => data.ip));
  }
}
