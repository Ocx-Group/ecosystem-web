import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketViewComponent } from './ticket-view.component';

import { testImports, testProviders } from '@app/testing/testing';
describe('TicketViewComponent', () => {
  let component: TicketViewComponent;
  let fixture: ComponentFixture<TicketViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [ TicketViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
