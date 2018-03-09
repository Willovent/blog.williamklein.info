import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentPipe } from './pipe/moment.pipe';
import { PostPreviewComponent, ScrollContainerComponent } from '@bw/shared/components';
import { materialModule } from './shared.module.material';
import { RouterModule } from '@angular/router';
import { BackGroundImageDirective } from './directive/background-image.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ...materialModule
  ],
  declarations: [
    MomentPipe,
    PostPreviewComponent,
    BackGroundImageDirective,
    ScrollContainerComponent
  ],
  exports: [
    MomentPipe,
    PostPreviewComponent,
    ScrollContainerComponent,
    BackGroundImageDirective
  ]
})
export class SharedModule { }
