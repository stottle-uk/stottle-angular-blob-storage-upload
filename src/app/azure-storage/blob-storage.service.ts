import { Inject, Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import {
  BLOB_STORAGE_TOKEN,
  IBlobService,
  IBlobStorage,
  ISasToken,
  ISpeedSummary
} from './azureStorage';

@Injectable()
export class BlobStorageService {
  constructor(@Inject(BLOB_STORAGE_TOKEN) private blobStorage: IBlobStorage) {}

  uploadToBlobStorage(sasToken: ISasToken, file: File): Observable<number> {
    const customBlockSize = this.getBlockSize(file);
    const options = { blockSize: customBlockSize };
    const blobService = this.createBlobService(sasToken.storageAccessToken, sasToken.storageUri);

    blobService.singleBlobPutThresholdInBytes = customBlockSize;

    return this.uploadFile(blobService, sasToken, file, options);
  }

  private createBlobService(accessToken: string, blobUri: string): IBlobService {
    return this.blobStorage
      .createBlobServiceWithSas(blobUri, accessToken)
      .withFilter(new this.blobStorage.ExponentialRetryPolicyFilter());
  }

  private uploadFile(
    blobService: IBlobService,
    accessToken: ISasToken,
    file: File,
    options: { blockSize: number }
  ): Observable<number> {
    return new Observable<number>(observer => {
      const speedSummary = blobService.createBlockBlobFromBrowserFile(
        accessToken.container,
        accessToken.filename,
        file,
        options,
        error => this.callback(error, observer)
      );
      speedSummary.on('progress', () => this.getProgress(speedSummary, observer));
    }).pipe(distinctUntilChanged());
  }

  private getProgress(speedSummary: ISpeedSummary, observer: Subscriber<number>): void {
    const progress = parseInt(speedSummary.getCompletePercent(2), 10);
    observer.next(progress === 100 ? 99 : progress);
  }

  private callback(error: any, observer: Subscriber<number>): void {
    if (error) {
      observer.error(error);
    } else {
      observer.next(100);
      observer.complete();
    }
  }

  private getBlockSize(file: File): number {
    const size32Mb = 1024 * 1024 * 32;
    const size4Mb = 1024 * 1024 * 4;
    const size512Kb = 1024 * 512;

    return file.size > size32Mb ? size4Mb : size512Kb;
  }
}
