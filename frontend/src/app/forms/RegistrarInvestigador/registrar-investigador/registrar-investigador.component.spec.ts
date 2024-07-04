import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarInvestigadorComponent } from './registrar-investigador.component';

describe('RegistrarInvestigadorComponent', () => {
  let component: RegistrarInvestigadorComponent;
  let fixture: ComponentFixture<RegistrarInvestigadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarInvestigadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarInvestigadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
