import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { PerfectScrollbarModule } from '@app/shared/perfect-scrollbar.module';

import { ClientUnilevelTreeComponentComponent } from './unilevel-tree-component/client-unilevel-tree-component.component';
import { ViewUnilevelTreeComponent } from './page/view-unilevel-tree.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgxDropzoneModule} from "ngx-dropzone";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";

@NgModule({
  declarations: [ClientUnilevelTreeComponentComponent, ViewUnilevelTreeComponent],
  imports: [CommonModule, PerfectScrollbarModule, NgbModule, TranslatePipe, NgbPopoverModule, NgxSpinnerModule, NgxDropzoneModule, ReactiveFormsModule, NgxDatatableModule],
})
export class ClientUnilevelTreeModule {}
