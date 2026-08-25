import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-maintenance',
    templateUrl: './maintenance-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class MaintenancePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
