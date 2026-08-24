import { Component } from '@angular/core';
import { MyTreeNodeClient } from '@app/core/models/unilevel-tree-model/tree-node';
import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from "@app/core/service/authentication-service/auth.service";
import { AffiliateService } from "@app/core/service/affiliate-service/affiliate.service";
import {UserAffiliate} from "@app/core/models/user-affiliate-model/user.affiliate.model";

@Component({
    selector: 'app-view-unilevel-tree',
    templateUrl: './view-unilevel-tree.component.html',
    styleUrls: ['./view-unilevel-tree.component.scss'],
    standalone: false
})
export class ViewUnilevelTreeComponent {
  userId: number;
  user: UserAffiliate;
  btnBack: boolean = false;
  active;

  tree: MyTreeNodeClient = {
    id: 0,
    userName: '',
    image: '',
    children: [],
  };
  typeSelected: string;
  showDiv = false;

  private isPanning = false;
  private panStartX = 0;
  private panStartY = 0;
  private panScrollLeft = 0;
  private panScrollTop = 0;

  constructor(
    private authService: AuthService,
    private spinnerService: NgxSpinnerService,
    private affiliateService: AffiliateService
  ) {
    this.typeSelected = 'cube-transition';
  }

  ngOnInit() {
    this.active = 1;
    this.user = this.authService.currentUserAffiliateValue;
    this.userId = this.user.id;
    if (this.userId) {
      this.onloadFamilyTree(this.userId);
      this.btnBack = false;
    }
  }

  protected onloadFamilyTree(id: number) {
    this.showDiv = false;
    this.spinnerService.show();
    this.btnBack = true;
    switch (this.active) {
      case 1:
        this.affiliateService.getUniLevelTree(id).subscribe(
          (users: MyTreeNodeClient) => {
            if (users !== null) {
              console.log(users);
              this.tree = users;
              setTimeout(() => {
                this.spinnerService.hide();
                this.showDiv = true;
              }, 500);
            }
          },
          error => {
            this.spinnerService.hide();
          }
        );
        break;
      case 2:
        this.affiliateService.getBinaryTree(id).subscribe(
          (users: MyTreeNodeClient) => {
            if (users !== null) {
              console.log(users);
              this.tree = users;
              setTimeout(() => {
                this.spinnerService.hide();
                this.showDiv = true;
              }, 500);
            }
          },
          error => {
            this.spinnerService.hide();
          }
        );
        break;
      case 3:
        this.affiliateService.getTreeModel5(id).subscribe(
          (users: MyTreeNodeClient) => {
            if (users !== null) {
              console.log(users);
              this.tree = users;
              setTimeout(() => {
                this.spinnerService.hide();
                this.showDiv = true;
              }, 500);
            }
          },
          error => {
            this.spinnerService.hide();
          }
        );
        break;
      case 4:
        this.affiliateService.getTreeModel6(id).subscribe(
          (users: MyTreeNodeClient) => {
            if (users !== null) {
              console.log(users);
              this.tree = users;
              setTimeout(() => {
                this.spinnerService.hide();
                this.showDiv = true;
              }, 500);
            }
          },
          error => {
            this.spinnerService.hide();
          }
        );
        break;
    }
  }

  startPan(event: MouseEvent, container: HTMLElement) {
    this.isPanning = true;
    this.panStartX = event.clientX;
    this.panStartY = event.clientY;
    this.panScrollLeft = container.scrollLeft;
    this.panScrollTop = container.scrollTop;
    container.classList.add('is-panning');
  }

  onPan(event: MouseEvent, container: HTMLElement) {
    if (!this.isPanning) return;
    event.preventDefault();
    container.scrollLeft =
      this.panScrollLeft - (event.clientX - this.panStartX);
    container.scrollTop = this.panScrollTop - (event.clientY - this.panStartY);
  }

  endPan(container: HTMLElement) {
    if (!this.isPanning) return;
    this.isPanning = false;
    container.classList.remove('is-panning');
  }

  onTabChange(newActiveId: number) {
    this.active = newActiveId;
    this.onloadFamilyTree(this.userId);
    this.btnBack = false;
  }
}
