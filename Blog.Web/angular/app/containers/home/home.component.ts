import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogService } from '@bw/services';
import { Router } from '@angular/router';
import { Post } from '@bw/models';
import { PostPreviewComponent } from '@bw/shared/components';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  pageCount: number;
  currentIndex = 0;
  posts: Post[] = [];
  hasMore: boolean;
  selectedPost: PostPreviewComponent;

  constructor(private blogService: BlogService, private router: Router) { }

  ngOnInit() {
    this.nextPage();
  }

  goToPost(post: Post, _preview: PostPreviewComponent) {
    this.router.navigate(['/posts/', post.category.code, post.url]);
    this.selectedPost = _preview;
  }

  nextPage() {
    this.blogService.getPosts(this.currentIndex + 1).subscribe(x => {
      this.posts = this.posts.concat(x.posts);
      this.currentIndex = x.currentPageIndex;
      this.pageCount = x.totalPageNumber;
      this.hasMore = this.currentIndex < this.pageCount;
    });
  }

  ngOnDestroy(): void {
    setTimeout(() => {

      // F
      const firstElm: HTMLElement = document.querySelector('app-post mat-card');
      const first = firstElm.getBoundingClientRect();
      // L
      const lastElm = this.selectedPost.elementRef.nativeElement.querySelector('.mat-card-image');
      const last = lastElm.getBoundingClientRect();

      // I
      const invert = {
        top: last.top - first.top,
        left: last.left - first.left
      };

      firstElm.style.transform = `translate( ${invert.left}px, ${invert.top}px)`;
      firstElm.style.transition = `none`;
      lastElm.style.opacity = 0;

      // P
      requestAnimationFrame(() => {
        firstElm.style.transition = `transform .3s`;
        firstElm.style.transform = `none`;
      });
    });
  }
}
