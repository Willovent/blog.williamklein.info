import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppModuleShared } from './app.module';
import { AppComponent } from './app.component';
import { ServerTransferStateModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

@NgModule({
  bootstrap: [AppComponent],
  imports: [NoopAnimationsModule, AppModuleShared, ServerModule, ServerTransferStateModule, ModuleMapLoaderModule]
})
export class AppModule {}
