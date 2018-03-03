import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

declare var AzureStorage: any;

export interface IBlobAccessToken {
    storageAccount: string;
    sas: string;
    containerName: string;
}

@Injectable()
export class BlobStorageService {

  private finishedOrError = false;

  uploadToBlobStorage(accessToken: IBlobAccessToken, files: FileList): Observable<string> {
    const progress$ = new Subject<string>();
    const file = files.item(0);
    const speedSummary = this.uploadFile(accessToken, file, progress$);

    this.refreshProgress(speedSummary, progress$);

    return progress$.asObservable();
  }

  private uploadFile(accessToken: IBlobAccessToken, file: File, progress$): any {
    const customBlockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
    const blobUri = accessToken.storageAccount;
    const blobService = AzureStorage.createBlobServiceWithSas(blobUri, accessToken.sas);
    blobService.singleBlobPutThresholdInBytes = customBlockSize;

    return blobService.createBlockBlobFromBrowserFile(
      accessToken.containerName,
      file.name,
      file,
      { blockSize: customBlockSize },
      this.callback(progress$, accessToken)
    );
  }

  private refreshProgress(speedSummary, progress$): void {
    setTimeout(() => {
      if (!this.finishedOrError) {
        const progress = speedSummary.getCompletePercent();
        progress$.next(progress.toString());
        this.refreshProgress(speedSummary, progress$);
      }
    }, 200);
  }

  private callback(progress$, accessToken): (error, result, response) => void {
    return (error, result, response) => {
      this.finishedOrError = true;
      if (error) {
        progress$.error('Error uploading to blob storage: ' + JSON.stringify(accessToken));
      } else {
        progress$.next('100');
        progress$.complete();
      }
    };
  }
}
