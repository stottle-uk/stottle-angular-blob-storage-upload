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

  <div *ngIf="filesSelected">
    <h2>Upload Progress</h2> 
    <pre>{{uploadProgress$ | async | json}}</pre>
  </div>
  `,
  styles: []
})
export class AppComponent {
  uploadProgress$: Observable<IUploadProgress[]>;
  filesSelected = false;

  constructor(private blobStorage: BlobStorageService) {}

  onFileChange(event: any): void {
    this.filesSelected = true;

    this.uploadProgress$ = from(event.target.files as FileList).pipe(
      map(file => this.uploadFile(file)),
      combineAll()
    );
  }

  uploadFile(file: File): Observable<IUploadProgress> {
    const accessToken: ISasToken = {
      container: 'containername',
      filename: file.name,
      storageAccessToken:
        '?sv=2017-07-29&sr=c&sig=efvM0XPzJHA7gAy6rJHkARImqLDBglt6q7zN2kgrer4%3D&st=2018-07-22T14%3A45%3A18Z&se=2018-07-22T15%3A00%3A18Z&sp=acw',
      storageUri: 'http://localhost:10000/devstoreaccount1'
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
