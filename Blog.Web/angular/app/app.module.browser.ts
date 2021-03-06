﻿import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ORIGIN_URL, REQUEST } from '@nguniversal/aspnetcore-engine/tokens';
import { AppModuleShared } from './app.module';
import { AppComponent } from './app.component';
import { AuthService } from '@bw/services';

export function getOriginUrl() {
  return window.location.origin;
}

export function getRequest() {
  return { cookie: document.cookie };
}

export function handleToken(autService: AuthService) {
  return () => autService.handleAuthentication();
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [BrowserAnimationsModule, AppModuleShared],
  providers: [
    {
      provide: ORIGIN_URL,
      useFactory: getOriginUrl
    },
    { provide: APP_INITIALIZER, useFactory: handleToken, deps: [AuthService], multi: true },
    {
      provide: REQUEST,
      useFactory: getRequest
    }
  ]
})
export class AppModule {}
