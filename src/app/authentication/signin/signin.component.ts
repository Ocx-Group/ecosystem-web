import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Response } from '@app/core/models/response-model/response.model';
import { ToastrService } from 'ngx-toastr';
declare let particlesJS: any;

import { Signin } from '@app/core/models/signin-model/signin.model';
import { LogoService } from '@app/core/service/logo-service/logo.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SigninComponent implements OnInit {
  submitted = false;
  returnUrl: string;
  error = '';
  loading = false;
  hide = true;
  logoUrl: string;
  showPassword = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly logoService: LogoService,
    private readonly deviceService: DeviceDetectorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getTheme();
    this.authService.logoutUser();
    particlesJS.load(
      'particles-js',
      'assets/particles/particles.json',
      function () {},
    );
  }

  authLogin = new FormGroup({
    remeber: new FormControl('', []),
    email: new FormControl('', [Validators.required]),
    pwd: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ]),
  });

  loginSubmitted() {
    let signin = new Signin();
    this.submitted = true;
    this.error = '';
    signin.userName = this.authLogin.value.email;
    signin.password = this.authLogin.value.pwd;

    signin.browserInfo = this.deviceService.deviceInfo().browser;
    signin.operatingSystem = this.deviceService.deviceInfo().os;

    this.authService.fetchIpAddress().subscribe((ip) => {
      signin.ipAddress = ip;
      console.log(signin);

      if (signin.userName === '' || signin.password === '') {
        return;
      }
      this.loading = true;
      this.cdr.markForCheck();

      this.authService.loginUser(signin).subscribe((response: Response) => {
        if (response.success) {
          if (response.data.is_affiliate) {
            this.router.navigate(['/app/home']);
          } else {
            this.router.navigate(['admin/home-admin']);
          }
        } else {
          this.showError(response.message);
        }
        this.loading = false;
        this.cdr.markForCheck();
      });
    });
  }

  googleLoginSubmitted() {
    const deviceInfo = this.deviceService.deviceInfo();
    this.loading = true;

    this.authService.fetchIpAddress().subscribe((ip) => {
      this.authService
        .loginWithGoogle({
          browserInfo: deviceInfo.browser,
          operatingSystem: deviceInfo.os,
          ipAddress: ip,
        })
        .subscribe({
          next: (response: Response) => {
            if (response.success) {
              if (response.data.is_affiliate) {
                this.router.navigate(['/app/home']);
              } else {
                this.router.navigate(['admin/home-admin']);
              }
            } else {
              this.showError(response.message);
            }
            this.loading = false;
          },
          error: () => {
            this.showError('No fue posible iniciar sesión con Google.');
            this.loading = false;
            this.cdr.markForCheck();
          },
        });
    });
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  get f() {
    return this.authLogin.controls;
  }

  get Email(): FormControl {
    return this.authLogin.get('email') as FormControl;
  }

  get Pwd(): FormControl {
    return this.authLogin.get('pwd') as FormControl;
  }

  getTheme() {
    this.logoUrl = this.logoService.getLogoSrc();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.togglePasswordVisibility();
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
    }
  }
}
