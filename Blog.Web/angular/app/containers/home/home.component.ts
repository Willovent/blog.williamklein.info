import { Component, OnInit } from '@angular/core';
import { BlogService } from '@bw/services';
import { Router } from '@angular/router';
import { Post } from '@bw/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pageCount: number;
  currentIndex = 0;
  posts: Post[] = [];
  hasMore: boolean;

  constructor(private blogService: BlogService, private router: Router) { }

  ngOnInit() {
    this.nextPage();
  }

  goToPost(post: Post) {
    this.router.navigate(['/posts/', post.category.code, post.url]);
  }

  nextPage() {
    this.blogService.getPosts(this.currentIndex + 1).subscribe(x => {
      this.posts = this.posts.concat(x.posts);
      this.currentIndex = x.currentPageIndex;
      this.pageCount = x.totalPageNumber;
      this.hasMore = this.currentIndex < this.pageCount;
    });
  }
}
