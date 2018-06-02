import { Injectable, Inject } from '@angular/core';
import * as auth0 from 'auth0-js';
import { Observable ,  Observer } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';

@Injectable()
export class AuthService {
  auth0: auth0.WebAuth;

  constructor(private storageService: StorageService, @Inject(ORIGIN_URL) origin) {
    this.auth0 = new auth0.WebAuth({
      clientID: environment.authConfig.clientID,
      domain: environment.authConfig.domain,
      responseType: 'token id_token',
      audience: `https://${environment.authConfig.domain}/userinfo`,
      redirectUri: origin + '/back',
      scope: 'openid'
    });
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): Promise<void> {
    return new Promise((res, rej) => {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
        } else if (err) {
          console.log(err);
          rej(err);
        }
        res();
      });
    });
  }

  public get hasToken() {
    return !!this.storageService.getItem('access_token');
  }

  private setSession(authResult: AuthResult): void {
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    this.storageService.setItem('access_token', authResult.accessToken, { path: `/back`, expires: 30 });
    this.storageService.setItem('id_token', authResult.idToken, { path: `/back`, expires: 1 });
    this.storageService.setItem('expires_at', expiresAt, { path: `/back`, expires: 1 });
  }

  public logout(): void {
    this.storageService.removeItem('access_token');
    this.storageService.removeItem('id_token');
    this.storageService.removeItem('expires_at');
  }

  public get isAuthenticated(): boolean {
    const expiresAt = this.storageService.getItem('expires_at');
    return new Date().getTime() < expiresAt;
  }

  public renewToken(): Observable<AuthResult> {
    return Observable.create((observer: Observer<string>) => {
      this.auth0.checkSession({}, (err, res) => {
        if (err) {
          observer.error(err);
        } else {
          this.setSession(res);
          observer.next(res);
        }
      });
    });
  }

  public get token(): string {
    return this.isAuthenticated ? this.storageService.getItem('id_token') : null;
  }
}

export interface AuthResult {
  accessToken: string;
  idToken: string;
  expiresIn: number;
}
