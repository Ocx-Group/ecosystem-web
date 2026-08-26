import { UserService } from '@app/core/service/user-service/user.service';
import { ChangeDetectorRef, Component, ViewChild, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@app/core/models/user-model/user.model';

@Component({
    selector: 'app-my-profile-edit-personal-info-modal',
    templateUrl: './my-profile-edit-personal-info-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class MyProfileEditPersonalInfoModalComponent implements OnInit {
  editPersonalInfoForm: FormGroup;
  submitted = false;
  public user: User = new User();
  @Input() personalInfo: any = [];
  @ViewChild('editPersonalInfoModal') editPersonalInfoModal: NgbModal;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadValidations();
  }

  loadValidations() {
    this.editPersonalInfoForm = this.formBuilder.group({
      user_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  // OJO: quien abre este modal (client/my-profile) pasa un UserAffiliate, no un
  // User, y onSaveEditInfoValues acaba llamando a userService.updateUser. El
  // desajuste de modelos es previo; aqui solo se deja de mentir sobre el tipo.
  openEditPersonalInfoModal(content, user: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.onSetValuesPersonalInfo(user);
    // Al modal lo abre el padre desde su plantilla: ese click ensucia la
    // vista del PADRE, no la de este componente.
    this.cdr.markForCheck();
  }

  get edit_personal_info_controls(): { [key: string]: AbstractControl } {
    return this.editPersonalInfoForm.controls;
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  closeModals() {
    this.modalService.dismissAll();
  }

  onSetValuesPersonalInfo(user: User) {
    this.editPersonalInfoForm.setValue({
      user_name: user.name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
  }

  onSaveEditInfoValues() {
    this.submitted = true;
    if (this.editPersonalInfoForm.invalid) {
      return;
    }
    this.user = this.personalInfo;

    this.user.name = this.editPersonalInfoForm.value.user_name;
    this.user.last_name = this.editPersonalInfoForm.value.last_name;
    this.user.email = this.editPersonalInfoForm.value.email;
    this.user.phone = this.editPersonalInfoForm.value.phone;
    this.user.address = this.editPersonalInfoForm.value.address;
    this.userService.updateUser(this.user).subscribe((response) => {
      if (response.success) {
        this.showSuccess('The user was update successfully!');
        this.closeModals();
      }
    });
  }
}
