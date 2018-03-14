import { Component, ViewEncapsulation, OnDestroy, OnInit, PLATFORM_ID, Inject, ApplicationRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { routerTransition } from './app.router.transitions';
import { Subscription } from 'rxjs/Subscription';
import { map, filter, take, mergeMap } from 'rxjs/operators';
import { EventReplayer } from 'preboot';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [routerTransition],
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  private endPageTitle = 'Blog de William Klein';
  private defaultPageTitle = 'Blog de William Klein';

  private routerSub$: Subscription;
  private request;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private replayer: EventReplayer
  ) { }

  ngOnInit() {
    this._changeTitleOnNavigation();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.router.initialNavigation();
      if (isPlatformBrowser(this.platformId)) {
        this.appRef.isStable
          .pipe(
            filter(stable => stable),
            take(1)
          )
          .subscribe(() => {
            this.replayer.replayAll();
          });
      }
    });
  }

  ngOnDestroy() {
    this.routerSub$.unsubscribe();
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  private _changeTitleOnNavigation() {
    this.routerSub$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        this._setMetaAndLinks(event);
      });
  }

  private _setMetaAndLinks(event) {
    const title = event['title']
      ? `${event['title']} - ${this.endPageTitle}`
      : `${this.defaultPageTitle} - ${this.endPageTitle}`;

    this.title.setTitle(title);

    const metaData = event['meta'] || [];
    const linksData = event['links'] || [];

    for (let i = 0; i < metaData.length; i++) {
      this.meta.updateTag(metaData[i]);
    }
  }
}
