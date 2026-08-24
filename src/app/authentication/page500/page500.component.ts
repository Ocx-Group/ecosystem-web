import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-page500',
    templateUrl: './page500.component.html',
    styleUrls: ['./page500.component.sass'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Page500Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
