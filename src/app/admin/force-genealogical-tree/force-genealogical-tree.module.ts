import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForceGenealogicalTreeComponent } from './force-genealogical-tree-component/force-genealogical-tree.component';
import { PageForceGenealogicalTreeComponent } from './page/page-force-genealogical-tree.component';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ForceGenealogicalTreeComponent,
    PageForceGenealogicalTreeComponent,
  ],
  imports: [CommonModule,TranslatePipe],
})
export class ForceGenealogicalTreeModule {}
