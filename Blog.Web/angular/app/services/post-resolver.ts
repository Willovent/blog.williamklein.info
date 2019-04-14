import { Injectable } from '@angular/core';
import { Post } from '@bw/models';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { BlogService } from './blog.service';
import { mergeMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostResolverService implements Resolve<Post> {

  constructor(private blogService: BlogService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Post> | Observable<never> {

    return this.blogService.getPost(route.params['categoryCode'], route.params['postUrl']).pipe(
      take(1),
      mergeMap(post => {
        if (post) {
          return of(post);
        } else { // id not found
          this.router.navigate(['/']);
          return EMPTY;
        }
      })
    );
  }

}
