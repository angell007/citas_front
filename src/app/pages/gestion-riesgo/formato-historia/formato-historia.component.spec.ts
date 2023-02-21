import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoHistoriaComponent } from './formato-historia.component';

describe('FormatoHistoriaComponent', () => {
  let component: FormatoHistoriaComponent;
  let fixture: ComponentFixture<FormatoHistoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormatoHistoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoHistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
