import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-services-and-products',
    templateUrl: './services-and-products.component.html',
    styleUrls: ['./services-and-products.component.sass'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ServicesAndProductsComponent implements OnInit {
  active: any;

  constructor(private toast: ToastrService) {

  }

  ngOnInit(): void {

  }

  onTabChange(newActive: number) {
    this.active = newActive;
  }
}
