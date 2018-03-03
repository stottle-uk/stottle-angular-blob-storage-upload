import { TestBed, inject } from '@angular/core/testing';

import { BlobStorageService } from './blob-storage.service';

describe('BlobStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlobStorageService]
    });
  });

  it('should be created', inject([BlobStorageService], (service: BlobStorageService) => {
    expect(service).toBeTruthy();
  }));
});
