import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarCatalogoComponent } from './registrar-catalogo.component';

describe('RegistrarCatalogoComponent', () => {
  let component: RegistrarCatalogoComponent;
  let fixture: ComponentFixture<RegistrarCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarCatalogoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
