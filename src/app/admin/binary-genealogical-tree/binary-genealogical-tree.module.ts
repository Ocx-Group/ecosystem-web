import { BinaryGenealogicalTreeComponent } from './binary-genealogical-tree-component/binary-genealogical-tree.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBinaryGenealogicalTreeComponent } from './page/page-binary-genealogical-tree.component';
import { TranslatePipe } from '@ngx-translate/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PerfectScrollbarModule } from '@app/shared/perfect-scrollbar.module';



@NgModule({
  declarations: [BinaryGenealogicalTreeComponent, PageBinaryGenealogicalTreeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    NgbPopoverModule,
    NgxSpinnerModule,
    TranslatePipe,
    PerfectScrollbarModule
  ]
})
export class BinaryGenealogicalTreeModule { }
