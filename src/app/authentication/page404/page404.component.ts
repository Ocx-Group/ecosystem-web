import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-page404',
    templateUrl: './page404.component.html',
    styleUrls: ['./page404.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class Page404Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
