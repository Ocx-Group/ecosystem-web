import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketViewAdminComponent } from './ticket-view-admin.component';

describe('TicketViewAdminComponent', () => {
  let component: TicketViewAdminComponent;
  let fixture: ComponentFixture<TicketViewAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketViewAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketViewAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
