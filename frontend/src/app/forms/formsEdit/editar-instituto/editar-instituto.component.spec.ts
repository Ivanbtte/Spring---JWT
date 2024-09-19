import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarInstitutoComponent } from './editar-instituto.component';

describe('EditarInstitutoComponent', () => {
  let component: EditarInstitutoComponent;
  let fixture: ComponentFixture<EditarInstitutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarInstitutoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarInstitutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
