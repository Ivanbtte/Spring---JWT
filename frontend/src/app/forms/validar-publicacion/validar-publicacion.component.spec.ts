import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarPublicacionComponent } from './validar-publicacion.component';

describe('ValidarPublicacionComponent', () => {
  let component: ValidarPublicacionComponent;
  let fixture: ComponentFixture<ValidarPublicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidarPublicacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidarPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
