import {
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  NgModule,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';

// Reemplazo local de ngx-perfect-scrollbar, que quedo en ViewEngine y no puede
// compilarse a partir de Angular 16. Mantiene la misma superficie publica
// (directiva [perfectScrollbar], token de configuracion e interfaz) para que el
// resto de la aplicacion no cambie: el scroll pasa a ser nativo y el aspecto
// de la barra se define en assets/scss/style.scss.

export interface PerfectScrollbarConfigInterface {
  wheelPropagation?: boolean;
  suppressScrollX?: boolean;
  suppressScrollY?: boolean;
}

export const PERFECT_SCROLLBAR_CONFIG = new InjectionToken<PerfectScrollbarConfigInterface>(
  'PERFECT_SCROLLBAR_CONFIG'
);

@Directive({
    selector: '[perfectScrollbar]',
    standalone: false
})
export class PerfectScrollbarDirective implements OnInit {
  @Input('perfectScrollbar') config?: PerfectScrollbarConfigInterface | string;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Optional() @Inject(PERFECT_SCROLLBAR_CONFIG) private defaults: PerfectScrollbarConfigInterface
  ) {}

  ngOnInit(): void {
    const config: PerfectScrollbarConfigInterface = {
      ...(this.defaults || {}),
      ...(typeof this.config === 'object' ? this.config : {}),
    };

    this.renderer.addClass(this.el.nativeElement, 'ps-scroll');
    this.renderer.setStyle(
      this.el.nativeElement,
      'overflow-y',
      config.suppressScrollY ? 'hidden' : 'auto'
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      'overflow-x',
      config.suppressScrollX === false ? 'auto' : 'hidden'
    );

    // wheelPropagation: false replica el comportamiento de perfect-scrollbar,
    // que impedia que la rueda arrastrase al contenedor padre al llegar al tope.
    if (config.wheelPropagation === false) {
      this.renderer.setStyle(this.el.nativeElement, 'overscroll-behavior', 'contain');
    }
  }
}

@NgModule({
  declarations: [PerfectScrollbarDirective],
  exports: [PerfectScrollbarDirective],
})
export class PerfectScrollbarModule {}
