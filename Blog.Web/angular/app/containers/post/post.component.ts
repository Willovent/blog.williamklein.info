import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.prod';
import { BlogService } from '@bw/services';
import { Post } from '@bw/models';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, AfterViewInit {
  post: Post;
  identifier: string;
  @ViewChild('card', {read: ElementRef})
  card: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private meta: Meta,
    private title: Title
  ) { }

  ngOnInit() {
    this.post = this.route.snapshot.data['post'];
    this.blogService.addMetaFromPost(this.meta, this.post);
    this.identifier = this.post.url;
    if (!environment.production) {
      this.identifier += '-dev';
    }
    this.title.setTitle(this.post.title + ' - Blog de William Klein');
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.card.nativeElement.style.opacity = '1');
  }
}
