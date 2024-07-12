import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigadorComponent } from './investigador.component';

describe('InvestigadorComponent', () => {
  let component: InvestigadorComponent;
  let fixture: ComponentFixture<InvestigadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestigadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
