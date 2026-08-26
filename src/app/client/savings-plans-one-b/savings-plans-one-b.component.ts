import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-savings-plans-one-b',
    templateUrl: './savings-plans-one-b.component.html',
    styleUrls: ['./savings-plans-one-b.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SavingsPlansOneBComponent {
  active: number = 6;
}
