import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPublicacionComponent } from './registrar-publicacion.component';

describe('RegistrarPublicacionComponent', () => {
  let component: RegistrarPublicacionComponent;
  let fixture: ComponentFixture<RegistrarPublicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarPublicacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
