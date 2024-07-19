import { TestBed } from '@angular/core/testing';

import { RutasGuard } from './rutas.guard';

describe('RutasGuard', () => {
  let guard: RutasGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RutasGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
