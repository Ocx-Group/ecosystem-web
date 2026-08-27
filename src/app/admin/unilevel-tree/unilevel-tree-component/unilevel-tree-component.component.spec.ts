import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { testProviders } from '@app/testing/testing';
import { UnilevelTreeComponentComponent } from './unilevel-tree-component.component';

/**
 * Lo que hay que demostrar antes de pasar los arboles a OnPush.
 *
 * El boton de plegar vive en un <ng-template> declarado en la PAGINA y se
 * proyecta dentro del componente recursivo con *ngTemplateOutlet. Al pulsarlo
 * muta `node.hideChildren` en sitio, y quien decide si se ve el subarbol es un
 * @if que esta en la plantilla del componente recursivo, no en la de la pagina.
 *
 * La pregunta es a que vista engancha Angular esa vista embebida: si al
 * contenedor (el arbol) o al declarante (la pagina). De eso depende que el
 * plegado siga funcionando cuando el arbol sea OnPush, y el fallo seria
 * silencioso: ni el build ni un test de humo lo verian.
 */
@Component({
  standalone: false,
  template: `
    <app-unilevel-tree-component [data]="tree" [nodeTemplate]="nodeTemplate">
    </app-unilevel-tree-component>
    <ng-template #nodeTemplate let-node>
      <span class="nombre">{{ node?.userName }}</span>
      @if (node?.children?.length) {
        <button
          type="button"
          class="plegar"
          (click)="node.hideChildren = !node.hideChildren"
        >
          {{ node.hideChildren ? '+' : '-' }}
        </button>
      }
    </ng-template>
  `,
  // La pagina real es Eager; se deja igual para no falsear la prueba.
  changeDetection: ChangeDetectionStrategy.Eager,
})
class PaginaAnfitrionaComponent {
  tree: any = {
    id: 1,
    userName: 'raiz',
    hideChildren: false,
    children: [
      { id: 2, userName: 'hijo-a', hideChildren: false, children: [] },
      { id: 3, userName: 'hijo-b', hideChildren: false, children: [] },
    ],
  };
}

describe('UnilevelTreeComponentComponent: plegado desde la plantilla proyectada', () => {
  let fixture: ComponentFixture<PaginaAnfitrionaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginaAnfitrionaComponent, UnilevelTreeComponentComponent],
      imports: [NgbPopoverModule],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaAnfitrionaComponent);
    fixture.detectChanges();
  });

  function nombres(): string[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('.nombre') as NodeListOf<HTMLElement>,
    ).map(e => e.textContent.trim());
  }

  it('parte mostrando la raiz y sus dos hijos', () => {
    expect(nombres()).toEqual(['raiz', 'hijo-a', 'hijo-b']);
  });

  it('al pulsar plegar en la raiz, sus hijos dejan de verse', () => {
    const plegar: HTMLButtonElement =
      fixture.nativeElement.querySelector('.plegar');
    plegar.click();
    fixture.detectChanges();

    expect(nombres()).toEqual(['raiz']);
  });

  it('al volver a pulsar, los hijos reaparecen', () => {
    const plegar: HTMLButtonElement =
      fixture.nativeElement.querySelector('.plegar');
    plegar.click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.plegar').click();
    fixture.detectChanges();

    expect(nombres()).toEqual(['raiz', 'hijo-a', 'hijo-b']);
  });
});
