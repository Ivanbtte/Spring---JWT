import { TestBed } from '@angular/core/testing';

import { TrimestreService } from './trimestre.service';

describe('TrimestreService', () => {
  let service: TrimestreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrimestreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
