import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home').then(x => x.Home)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login').then(x => x.Login)
    },
    {
        path: 'logout',
        loadComponent: () => import('./pages/logout').then(x => x.Logout)
    },
    {
        path: '**',
        loadComponent: () => import('./pages/not-found').then(x => x.NotFound)
    }
];
