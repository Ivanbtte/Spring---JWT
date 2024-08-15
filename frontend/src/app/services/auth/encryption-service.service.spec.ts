import { TestBed } from '@angular/core/testing';

import { EncryptionServiceService } from './encryption-service.service';

describe('EncryptionServiceService', () => {
  let service: EncryptionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
