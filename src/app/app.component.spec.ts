import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BLOB_STORAGE_TOKEN } from './azure-storage/azureStorage';
import { blobStorageStub } from './azure-storage/blob-storage-stub';
import { BlobStorageService } from './azure-storage/blob-storage.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        BlobStorageService,
        {
          provide: BLOB_STORAGE_TOKEN,
          useValue: blobStorageStub
        }
      ]
    }).compileComponents();
  }));
});
