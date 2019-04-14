import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { PostComponent } from './containers/post/post.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';
import { PostResolverService } from './services/post-resolver';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { state: 'home' } },
  { path: 'back', loadChildren: './modules/backoffice/backoffice.module#BackOfficeModule' },
  {
    path: 'posts/:categoryCode/:postUrl',
    component: PostComponent,
    data: { title: 'Article', state: 'post' },
    resolve: { post: PostResolverService }
  },
  { path: '**', component: NotFoundComponent, data: { title: '404 - Not found' } }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes);
