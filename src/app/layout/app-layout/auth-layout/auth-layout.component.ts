import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-auth-layout',
    templateUrl: './auth-layout.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AuthLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
