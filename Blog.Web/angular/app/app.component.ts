import { Component, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { routerTransition } from './app.router.transitions';
import { Subscription } from 'rxjs/Subscription';
import { map, filter, mergeMap, tap } from 'rxjs/operators';

declare var ga;

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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
  ) { }

  ngOnInit() {
    this.changeTitleOnNavigation();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.router.initialNavigation();
    });
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  ngOnDestroy() {
    this.routerSub$.unsubscribe();
  }

  private changeTitleOnNavigation() {
    this.routerSub$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap((event: NavigationEnd) => {
          typeof (ga) !== 'undefined' ? ga('send', 'pageview', event.urlAfterRedirects) : null;
        }),
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
        this.setMetaAndLinks(event);
      });
  }

  private setMetaAndLinks(event) {
    const title = event['title']
      ? `${event['title']} - ${this.endPageTitle}`
      : `${this.defaultPageTitle} - ${this.endPageTitle}`;
    this.title.setTitle(title);
  }
}
