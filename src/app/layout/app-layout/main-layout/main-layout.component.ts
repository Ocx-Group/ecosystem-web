import { MembershipManagerService } from '@app/core/service/membership-manager-service/membership-manager.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { DocumentCheckService } from '@app/core/service/document-check-service/document-check.service';
import { TermsConditionsService } from '@app/core/service/terms-conditions-service/terms-conditions.service';
import Swal from 'sweetalert2';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { ToastrService } from 'ngx-toastr';
import { TicketHubService } from '@app/core/service/ticket-service/ticket-hub.service';


@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MainLayoutComponent implements OnInit {
  user: UserAffiliate = new UserAffiliate();
  constructor(
    private documentCheckService: DocumentCheckService,
    private termsConditionsService: TermsConditionsService,
    private authService: AuthService,
    private membershipManagerService: MembershipManagerService,
    private affiliateService: AffiliateService,
    private toast: ToastrService,
    private ticketHubService: TicketHubService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.authService.currentUserAffiliateValue;
  }

  ngAfterViewInit(): void {
    // if (!this.user.termsConditions) {
    //   this.showTermsConditionsModal();
    // }

    if (this.user.activation_date == null) {
      this.showMembershipManager();
    } else if (this.user.message_alert == 0) {
      this.showAlert();
    }
  }

  showMembershipManager() {
    this.membershipManagerService.show();
  }

  showTermsConditionsModal() {
    this.termsConditionsService.show();
  }

  messageReceived() {
    this.affiliateService.updateMessageAlert(this.user.id).subscribe({
      next: (value) => {
        this.showSuccess('Mensaje recibido correctamente');
        this.user.message_alert = 1;
        this.authService.setUserAffiliateValue(this.user);
      },
      error: (err) => {
        this.showError('Error');
      },
    })
  }

  showAlert() {
    Swal.fire({
      icon: 'info',
      title: 'Actualiza tu teléfono y correo electrónico',
      html: `
            <p>Querido afiliado,</p>
            <p>Estamos mejorando la forma en que nos comunicamos contigo. Por el correo y el teléfono te enviamos confirmaciones de compra, avisos de pago y los códigos para recuperar tu cuenta, así que es importante que estén al día.</p>
            <p>Estos son los datos que tenemos registrados:</p>
            <p>
              <strong>Correo:</strong> ${this.escapeHtml(this.user.email) || 'Sin registrar'}<br>
              <strong>Teléfono:</strong> ${this.escapeHtml(this.user.phone) || 'Sin registrar'}
            </p>
            <p>Si alguno cambió o no es correcto, por favor actualízalo en <strong>Mi perfil &gt; Editar información personal</strong>.</p>
            <p>¡Gracias por ayudarnos a mantenerte informado!</p>
        `,
      confirmButtonText: 'Actualizar mis datos',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      cancelButtonText: 'Mis datos están correctos',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.messageReceived();
        this.router.navigate(['/app/my-profile']);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.messageReceived();
      }
    });
  }

  private escapeHtml(value?: string): string {
    return (value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  showSuccess(message: string) {
    this.toast.success(message);
  }

  showError(message: string) {
    this.toast.error(message);
  }
}
