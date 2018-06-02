import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@bw/services';
import { isPlatformServer } from '@angular/common';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class AutInterceptor implements HttpInterceptor {
  constructor(private autService: AuthService, @Inject(PLATFORM_ID) private platformId) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.autService.isAuthenticated) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${this.autService.token}` }
      });
    }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (isPlatformServer(this.platformId)) {
          throw new Error(err.statusText);
        }
        if (err.status === 401) {
          return this.autService.renewToken().pipe(
            mergeMap(token => {
              req = req.clone({
                setHeaders: { Authorization: `Bearer ${token.idToken}` }
              });
              return next.handle(req);
            })
          );
        } else {
          throw new Error(err.statusText);
        }
      })
    );
  }
}
