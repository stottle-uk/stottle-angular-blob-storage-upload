import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

declare var AzureStorage: any;

export interface IBlobAccessToken {
  blobAccountUrl: string;
  sasToken: string;
  containerName: string;
}

@Injectable()
export class BlobStorageService {

  private finishedOrError = false;

  uploadToBlobStorage(accessToken: IBlobAccessToken, file: File): Observable<number> {
    const progress$ = new Subject<number>();
    const speedSummary = this.uploadFile(accessToken, file, progress$);

    this.refreshProgress(speedSummary, progress$);

    return progress$.asObservable();
  }

  private uploadFile(accessToken: IBlobAccessToken, file: File, progress$: Subject<number>): any {
    const customBlockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
    const blobUri = accessToken.blobAccountUrl;
    const blobService = AzureStorage
      .createBlobServiceWithSas(blobUri, accessToken.sasToken)
      .withFilter(new AzureStorage.ExponentialRetryPolicyFilter());

    blobService.singleBlobPutThresholdInBytes = customBlockSize;

    return blobService.createBlockBlobFromBrowserFile(
      accessToken.containerName,
      file.name,
      file,
      { blockSize: customBlockSize },
      this.callback(progress$, accessToken)
    );
  }

  private refreshProgress(speedSummary: any, progress$: Subject<number>): void {
    setTimeout(() => {
      if (!this.finishedOrError) {
        const progress = speedSummary.getCompletePercent();
        progress$.next(progress);
        this.refreshProgress(speedSummary, progress$);
      }
    }, 200);
  }

  private callback(progress$: Subject<number>, accessToken: IBlobAccessToken): (error, result, response) => void {
    return (error, result, response) => {
      this.finishedOrError = true;
      if (error) {
        progress$.error('Error uploading to blob storage: ' + JSON.stringify(accessToken));
      } else {
        progress$.next(100);
        progress$.complete();
      }
    };
  }
}
