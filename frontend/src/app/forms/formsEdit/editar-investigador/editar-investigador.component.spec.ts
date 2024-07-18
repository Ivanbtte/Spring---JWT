import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarInvestigadorComponent } from './editar-investigador.component';

describe('EditarInvestigadorComponent', () => {
  let component: EditarInvestigadorComponent;
  let fixture: ComponentFixture<EditarInvestigadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarInvestigadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarInvestigadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
