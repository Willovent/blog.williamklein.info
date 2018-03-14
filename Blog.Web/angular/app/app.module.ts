import { HeaderComponent } from '@bw/components';
import { HomeComponent, NotFoundComponent, PostComponent } from '@bw/containers';
import { BlogService, StorageService, AuthService } from '@bw/services';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { PrebootModule } from 'preboot';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { appRouting } from './app.routing';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { DisqusModule } from 'ngx-disqus';
import { SharedModule } from './modules/shared/shared.module';
import { materialModule } from './app.module.material';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AutInterceptor, RelativeUrlInterceptor } from './interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    PostComponent,
    HeaderComponent
  ],
  imports: [
    SharedModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    CommonModule,
    PrebootModule.withConfig({ appRoot: 'app-root' }),
    DisqusModule.forRoot('blog-ovent'),
    BrowserModule.withServerTransition({ appId: 'my-app-idds' }),
    HttpClientModule,
    TransferHttpCacheModule,
    FormsModule,
    appRouting,
    ...materialModule
  ],
  providers: [
    BlogService,
    StorageService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AutInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RelativeUrlInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModuleShared { }
