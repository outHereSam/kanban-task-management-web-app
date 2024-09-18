import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'board/:id',
    loadComponent: () =>
      import('../app/pages/board-detail/board-detail.component').then(
        (m) => m.BoardDetailComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('../app/pages/board-redirect/board-redirect.component').then(
        (m) => m.BoardRedirectComponent
      ),
  },
  {
    path: 'empty',
    loadComponent: () =>
      import('../app/pages/notfound/notfound.component').then(
        (m) => m.NotfoundComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('../app/pages/board-redirect/board-redirect.component').then(
        (m) => m.BoardRedirectComponent
      ),
  },
];
