import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
@Component({
    selector: 'app-page-loader',
    templateUrl: './page-loader.component.html',
    styleUrls: ['./page-loader.component.sass'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PageLoaderComponent implements OnInit {
  constructor() { }
  ngOnInit() { }
}
