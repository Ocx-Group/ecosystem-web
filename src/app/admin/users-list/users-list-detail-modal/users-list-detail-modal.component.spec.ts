import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@app/core/models/user-model/user.model';
import { testImports, testProviders } from '@app/testing/testing';
import { UsersListDetailModalComponent } from './users-list-detail-modal.component';

/**
 * Cubre el camino padre -> modal del patron #modalChild, que sostiene unos
 * treinta modales por app: el listado llama a modalChildDetail.detailOpenModal(fila)
 * y el modal tiene que abrirse con los datos de ESA fila.
 *
 * Es justo donde vivian los siete metodos que los gemelos habian perdido en la
 * migracion a standalone (el boton compilaba y lanzaba "is not a function").
 *
 * OJO con lo que este test NO prueba: no vale como regresion del markForCheck
 * del metodo de entrada. NgbModal crea la vista del <ng-template> con
 * createEmbeddedView y la engancha a ApplicationRef (ver _createFromTemplateRef
 * en @ng-bootstrap), asi que se comprueba en cada tick al margen de la
 * estrategia del componente que la declara. Quitando la marca, este test sigue
 * pasando.
 */
@Component({
  standalone: false,
  template: `
    <app-users-list-detail-modal #modalChildDetail></app-users-list-detail-modal>
    <button type="button" class="abrir" (click)="abrir()">Detalle</button>
  `,
  // El listado real es OnPush; lo que importa es que el click marca ESTA vista.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListadoAnfitrionComponent {
  @ViewChild('modalChildDetail')
  modal: UsersListDetailModalComponent;

  fila: User = Object.assign(new User(), {
    name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada@ejemplo.test',
    user_name: 'ada',
  });

  abrir(): void {
    // El padre pasa el TemplateRef del hijo, igual que en las plantillas reales.
    this.modal.detailOpenModal(this.modal['userDetailModal'], this.fila);
  }
}

describe('UsersListDetailModalComponent: el padre lo abre desde su plantilla', () => {
  let fixture: ComponentFixture<ListadoAnfitrionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [ListadoAnfitrionComponent, UsersListDetailModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoAnfitrionComponent);
    fixture.detectChanges();
  });

  it('pinta los datos de la fila al abrirlo', () => {
    fixture.nativeElement.querySelector('.abrir').click();
    fixture.detectChanges();

    // El contenido del modal vive en un ng-template que abre NgbModal, o sea
    // fuera del arbol del fixture: se busca en el documento.
    const texto = document.body.textContent;
    expect(texto).toContain('ada@ejemplo.test');
    expect(texto).toContain('ada');
  });

  afterEach(() => {
    document.querySelectorAll('ngb-modal-window, ngb-modal-backdrop')
      .forEach(e => e.remove());
  });
});
