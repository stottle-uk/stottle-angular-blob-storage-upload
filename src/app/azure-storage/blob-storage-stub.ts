import { interval, timer } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { IBlobService, IBlobStorage, ISpeedSummary } from './azureStorage';

export let uploadProgressStub = 0;
export const blobStorageStub: IBlobStorage = {
  createBlobServiceWithSas: () => blobService,
  ExponentialRetryPolicyFilter: () => {}
};

let percentComplete = 0;

const speedSummary: ISpeedSummary = {
  on: (eventName: string, callback: () => void) => {
    interval(200)
      .pipe(
        take(4),
        map(intervalCount => 25 * (intervalCount + 1)),
        tap(progress => (percentComplete = progress)),
        tap(
          progress =>
            progress === 100 ? (uploadProgressStub = 99) : (uploadProgressStub = progress)
        )
      )
      .subscribe(() => callback());
  },
  getCompletePercent: () => percentComplete.toString(),
  getAverageSpeed: () => '',
  getSpeed: () => ''
};

const blobService: IBlobService = {
  createBlockBlobFromBrowserFile: (
    container: string,
    filename: string,
    file: File,
    options: any,
    callback: (error: any, response: any) => void
  ) => {
    timer(1000)
      .pipe(tap(() => (uploadProgressStub = 100)))
      .subscribe(() => callback(container, ''));
    return speedSummary;
  },
  withFilter: () => blobService,
  singleBlobPutThresholdInBytes: 10
};
