import { Component } from '@angular/core';
import { BlobStorageService, IBlobAccessToken } from './blob-storage/blob-storage.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stottle Blob Storage';
  uploadProgress: Observable<number>;

  constructor(private blob: BlobStorageService) { }

  onFileChange(event: any): void {
    const accessToken: IBlobAccessToken = {
      // tslint:disable-next-line:max-line-length
      sasToken: '?st=2018-02-27T14%3A14%3A00Z&se=2018-03-28T13%3A14%3A00Z&sp=rwdl&sv=2017-04-17&sr=c&sig=1Dn3dIoDlGYsXiruSRoIJspzVb8GmuGk6LsBCHudhns%3D',
      blobAccountUrl: 'http://localhost:10000/devstoreaccount1',
      containerName: 'mycontainer'
    };

    this.uploadProgress = this.blob
      .uploadToBlobStorage(accessToken, event.target.files[0]);
  }
}
