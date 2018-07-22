import { Component } from '@angular/core';
import { from, Observable } from 'rxjs';
import { combineAll, map } from 'rxjs/operators';
import { ISasToken } from './azure-storage/azureStorage';
import { BlobStorageService } from './azure-storage/blob-storage.service';

interface IUploadProgress {
  filename: string;
  progress: number;
}

@Component({
  selector: 'app-root',
  template: `
  <div style="text-align:center">
    <h1>
      Welcome to stottle-angular-blob-storage-upload
    </h1>
  </div>
  <input type="file" multiple="multiple" (change)="onFileChange($event)">   
  <h2>Upload Progress</h2> 
  <pre>{{uploadProgress$ | async | json}}</pre>
  `,
  styles: []
})
export class AppComponent {
  uploadProgress$: Observable<IUploadProgress[]>;

  constructor(private blobStorage: BlobStorageService) {}

  onFileChange(event: any): void {
    this.uploadProgress$ = from(event.target.files as FileList).pipe(
      map(file => this.uploadFile(file)),
      combineAll()
    );
  }

  uploadFile(file: File): Observable<IUploadProgress> {
    const accessToken: ISasToken = {
      container: 'feb886ea-e626-432c-98d8-8c0b764f06be',
      filename: file.name,
      storageAccessToken:
        '?sv=2017-07-29&sr=c&sig=i%2BM8kUK5hzQzSROeE4lb4N3qZ7HK8QaWz3nsV7HsTeo%3D&st=2018-07-22T13%3A36%3A21Z&se=2018-07-22T13%3A51%3A21Z&sp=acw',
      storageUri: 'https://stu227rpanuap5uvjtfqpvff.blob.core.windows.net/'
    };

    return this.blobStorage
      .uploadToBlobStorage(accessToken, file)
      .pipe(map(progress => this.mapProgress(file, progress)));
  }

  private mapProgress(file: File, progress: number): IUploadProgress {
    return {
      filename: file.name,
      progress: progress
    };
  }
}
