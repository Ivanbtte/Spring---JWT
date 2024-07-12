import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarPublicacionComponent } from './consultar-publicacion.component';

describe('ConsultarPublicacionComponent', () => {
  let component: ConsultarPublicacionComponent;
  let fixture: ComponentFixture<ConsultarPublicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarPublicacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
