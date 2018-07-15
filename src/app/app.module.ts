import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BlobStorageService } from './azure-storage/azure-storage.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [BlobStorageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
