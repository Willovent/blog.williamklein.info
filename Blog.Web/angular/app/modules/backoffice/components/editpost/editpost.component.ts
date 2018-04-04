import { PLATFORM_ID, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { Component, OnInit, Inject } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { BackOfficeService } from '../../services/backoffice.service';
import * as slug from 'slug';
import 'prismjs';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import { Post, Category } from '@bw/models';
import { isPlatformServer } from '@angular/common';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.scss']
})
export class EditPostComponent implements OnInit {
  markdown: string;
  id: number;
  html: string;
  date: Date;
  title: string;
  description: string;
  categtories: Category[];
  category: Category;
  isServer: boolean;
  showHeader = false;
  flushKey: string;
  tags: string[];
  separatorKeysCodes = [ENTER, COMMA];

  @Output() changed = new EventEmitter<Post>();

  @Input() post?: Post;

  @ViewChild(MarkdownComponent) renderedContent: MarkdownComponent;

  constructor(private backOfficeService: BackOfficeService, @Inject(PLATFORM_ID) platformId) {
    this.isServer = isPlatformServer(platformId);
  }

  ngOnInit() {
    this.backOfficeService.getCategories().subscribe(categ => {
      this.categtories = categ;
      if (this.post) {
        this.id = this.post.id;
        this.markdown = this.post.markDownContent;
        this.date = this.post.publicationDate;
        this.category = this.post.category;
        this.title = this.post.title;
        this.description = this.post.description;
        this.tags = this.post.tags;
      }
    });
  }

  submit() {
    const post: Post = {
      id: this.id,
      categoryId: this.category.id,
      category: this.category,
      description: this.description,
      content: this.renderedContent.element.nativeElement.innerHTML,
      markDownContent: this.markdown,
      title: this.title,
      publicationDate: this.date,
      url: slug(this.title),
      tags: this.tags
    };
    this.changed.emit(post);
  }

  flushCacheForKey() {
    this.backOfficeService.flushCache(this.flushKey).subscribe(() => (this.flushKey = ''));
  }
  removeTag(tag: string) {
    this.tags.splice(this.tags.indexOf(tag), 1);
  }
  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
}
