import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.sass'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FooterComponent {
  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }
}
