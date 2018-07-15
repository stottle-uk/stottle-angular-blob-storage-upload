import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BlobStorageService } from './azure-storage/azure-storage.service';
import { ISasToken } from './azure-storage/azureStorage';

@Component({
  selector: 'app-root',
  template: `
  <div style="text-align:center">
    <h1>
      Welcome to stottle-angular-blob-storage-upload
    </h1>
  </div>
  <input type="file" (change)="onFileChange($event)">   
  <h2>Upload Progress: {{uploadProgress$ | async}}%</h2>
  `,
  styles: []
})
export class AppComponent {
  uploadProgress$: Observable<number>;

  constructor(private blobStorage: BlobStorageService) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const accessToken: ISasToken = {
      container: 'mycontainer',
      filename: file.name,
      storageAccessToken:
        '?st=2018-02-27T14%3A14%3A00Z&se=2018-03-28T13%3A14%3A00Z&sp=rwdl&sv=2017-04-17&sr=c&sig=1Dn3dIoDlGYsXiruSRoIJspzVb8GmuGk6LsBCHudhns%3D',
      storageUri: 'http://localhost:10000/devstoreaccount1'
    };

    this.uploadProgress$ = this.blobStorage.uploadToBlobStorage(accessToken, event.target.files[0]);
  }
}
