import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BLOB_STORAGE_TOKEN, IBlobStorage } from './azure-storage/azureStorage';
import { BlobStorageService } from './azure-storage/blob-storage.service';

export function azureBlobStorageFactory(): IBlobStorage {
  return window['AzureStorage'].Blob;
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [
    BlobStorageService,
    {
      provide: BLOB_STORAGE_TOKEN,
      useFactory: azureBlobStorageFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
