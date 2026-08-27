import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MyTreeNode } from '@app/core/models/unilevel-tree-model/tree-node';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-page-binary-genealogical-tree',
    templateUrl: './page-binary-genealogical-tree.component.html',
    styleUrls: ['./page-binary-genealogical-tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PageBinaryGenealogicalTreeComponent implements OnInit {

  userId: number;
  tree: MyTreeNode = {
    id: 0,
    userName: '',
    imageProfileUrl: '',
    children: [
    ],
  };
  typeSelected: string;
  showDiv = false;

  constructor(
    private router: Router,
    private affiliateService: AffiliateService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.typeSelected = 'cube-transition';
  }


  ngOnInit() {
    this.userId = +this.activatedRoute.snapshot.params.id;
    this.onloadFamilyTree(this.userId);
    }


  public onloadFamilyTree(id: number){
    this.showDiv = false;
    this.spinnerService.show();

    this.tree = {
      id: 0,
      userName: '',
      imageProfileUrl: '',
      children: [
      ],
    };
    this.affiliateService.getBinaryTree(id).subscribe(
      (users: MyTreeNode) => {
        if (users !== null) {
          this.tree = this.initializeTreeNode(users);
          this.cdr.markForCheck();
          setTimeout(() => {
            this.spinnerService.hide();
            this.showDiv = true;
            this.cdr.markForCheck();
          }, 500);
        } else {
          console.error('El arbol binario llego vacio para el afiliado', id);
          this.spinnerService.hide();
        }
      },
      error => {
        console.error('Error loading binary tree:', error);
        this.spinnerService.hide();
      }
    );
  }

  private initializeTreeNode(node: MyTreeNode): MyTreeNode {
    if (!node) return node;

    node.hideChildren = node.hideChildren ?? false;

    if (!node.children) {
      node.children = [];
    }

    if (node.children.length > 0) {
      node.children = node.children.map(child => this.initializeTreeNode(child));
    }

    return node;
  }
}
