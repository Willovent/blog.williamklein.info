import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';

const isAbsoluteUrl = /^[a-zA-Z\-\+.]+:\/\//;

@Injectable()
export class RelativeUrlInterceptor implements HttpInterceptor {
  constructor(
    @Optional()
    @Inject(ORIGIN_URL)
    private originUrl: any
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = request.url;
    if (this.originUrl && url && !isAbsoluteUrl.test(url)) {
      url = this.originUrl + url;
    }
    request = request.clone({ url });
    return next.handle(request);
  }
}
