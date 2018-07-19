import { InjectionToken } from '@angular/core';

export interface IAzureStorage {
  Blob: IBlobStorage;
}

export interface IBlobStorage {
  ExponentialRetryPolicyFilter: any;
  createBlobServiceWithSas: (uri: string, sharedAccessToken: string) => IBlobService;
}

export interface ISpeedSummary {
  on: (event: string, callback: () => void) => void;
  getCompletePercent: (len?: number) => string;
  getAverageSpeed: () => string;
  getSpeed: () => string;
}

export interface IBlobService {
  withFilter: (filter: any) => IBlobService;
  createBlockBlobFromBrowserFile: (
    container: string,
    filename: string,
    file: File,
    options: any,
    callback: (error: any, response: any) => void
  ) => ISpeedSummary;
  singleBlobPutThresholdInBytes: number;
}

export interface ISasToken {
  storageUri: string;
  storageAccessToken: string;
  container: string;
  filename: string;
}

export const BLOB_STORAGE_TOKEN = new InjectionToken<IBlobStorage>('BLOB_STORAGE_TOKEN');
