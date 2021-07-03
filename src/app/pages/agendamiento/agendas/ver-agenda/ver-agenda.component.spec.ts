import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAgendaComponent } from './ver-agenda.component';

describe('VerAgendaComponent', () => {
  let component: VerAgendaComponent;
  let fixture: ComponentFixture<VerAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerAgendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
