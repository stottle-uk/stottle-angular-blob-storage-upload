import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BLOB_STORAGE_TOKEN, IAzureStorage } from './azure-storage/azureStorage';
import { BlobStorageService } from './azure-storage/blob-storage.service';

declare var AzureStorage: IAzureStorage;

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [
    BlobStorageService,
    {
      provide: BLOB_STORAGE_TOKEN,
      useValue: AzureStorage.Blob
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
