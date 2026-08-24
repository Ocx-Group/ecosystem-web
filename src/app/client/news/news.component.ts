import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NewsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
