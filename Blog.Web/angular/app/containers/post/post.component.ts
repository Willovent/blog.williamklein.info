import { Component, OnInit, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { EventReplayer } from 'preboot';
import { environment } from '../../../environments/environment.prod';
import { BlogService } from '@bw/services';
import { Post } from '@bw/models';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post: Post;
  identifier: string;

  constructor
    (
    private router: Router,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.blogService.getPost(params['categoryCode'], params['postUrl']).subscribe(post => {
        this.post = post;
        this.blogService.addMetaFromPost(this.meta, post);
        this.identifier = post.url;
        if (!environment.production) {
          this.identifier += '-dev';
        }
        this.title.setTitle(this.post.title + ' - Blog de William Klein');
      });
    });
  }
}
