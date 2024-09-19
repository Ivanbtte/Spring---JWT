import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTrimestreComponent } from './editar-trimestre.component';

describe('EditarTrimestreComponent', () => {
  let component: EditarTrimestreComponent;
  let fixture: ComponentFixture<EditarTrimestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarTrimestreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarTrimestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
