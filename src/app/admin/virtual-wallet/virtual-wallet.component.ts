import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-virtual-wallet',
    templateUrl: './virtual-wallet.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class VirtualWalletComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
