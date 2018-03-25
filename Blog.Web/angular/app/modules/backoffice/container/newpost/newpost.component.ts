import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackOfficeService } from '../../services/backoffice.service';
import { Post } from '@bw/models';

@Component({
  selector: 'app-newpost',
  templateUrl: './newpost.component.html',
  styleUrls: ['./newpost.component.scss']
})
export class NewPostComponent implements OnInit {
  constructor(private router: Router, private backOfficeService: BackOfficeService) {}

  ngOnInit() {}

  submit(post: Post) {
    const categ = post.category;
    delete post.category;
    this.backOfficeService.addPost(post).subscribe(() => {
      this.router.navigate(['/back/edit/', categ.code, post.url]);
    });
  }
}
