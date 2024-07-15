import { TestBed } from '@angular/core/testing';

import { InstitutoService } from './instituto.service';

describe('InstitutoService', () => {
  let service: InstitutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
