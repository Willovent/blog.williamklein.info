import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackOfficeService } from '../../services/backoffice.service';
import { Post } from '@bw/models';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-editpostcontainer',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.scss']
})
export class EditPostComponent implements OnInit {
  post: Post;
  constructor(private route: ActivatedRoute, private backOfficeService: BackOfficeService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.backOfficeService.getPost(params['categoryCode'], params['postUrl'])
        .subscribe(post => {
          this.post = post;
        });
    });
  }

  submit(post: Post) {
    this.backOfficeService.editPost(post).subscribe(() => {
      this.snackBar.open('Saved', null, {
        duration: 1000,
      });
    });
  }
}
