import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarArticuloComponent } from './editar-articulo.component';

describe('EditarArticuloComponent', () => {
  let component: EditarArticuloComponent;
  let fixture: ComponentFixture<EditarArticuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarArticuloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
