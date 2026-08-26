import { ChangeDetectorRef, Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Incentive } from '@app/core/models/incentive-model/incentive.model';
import { GradingService } from '@app/core/service/grading-service/grading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-incentives-list-details-modal',
    templateUrl: './incentives-list-details-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IncentivesListDetailsModalComponent implements OnInit {
  incentive: Incentive = new Incentive();
  calificationList: any[] = [];
  productListData: any[] = [];
  membershipData: any[] = [];
  active = 1;

  @ViewChild('incentiveDetailsModal') incentiveDetailsModal: NgbModal;

  constructor(
    private modalService: NgbModal,
    private gradingService: GradingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchCalificationList();
    this.fetchMembership();
    this.fetchProductList();
  }

  detailsOpenModal(content, incentive: Incentive) {
    this.incentive = incentive;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    // Al modal lo abre el padre desde su plantilla: ese click ensucia la
    // vista del PADRE, no la de este componente.
    this.cdr.markForCheck();
  }

  fetchCalificationList() {
    this.gradingService.getAll().subscribe((resp) => {
      if (resp !== null) {
        this.calificationList = resp;
        this.cdr.markForCheck();
      }
    });
  }

  fetchProductList() {
    this.gradingService.getProductList().subscribe((resp) => {
      this.productListData = resp;
      this.cdr.markForCheck();
    });
  }

  fetchMembership() {
    this.gradingService.getMembership().subscribe((resp) => {
      this.membershipData = resp;
      this.cdr.markForCheck();
    });
  }
}
