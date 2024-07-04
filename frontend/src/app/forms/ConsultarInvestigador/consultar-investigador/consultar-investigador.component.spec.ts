import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarInvestigadorComponent } from './consultar-investigador.component';

describe('ConsultarInvestigadorComponent', () => {
  let component: ConsultarInvestigadorComponent;
  let fixture: ComponentFixture<ConsultarInvestigadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarInvestigadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarInvestigadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
