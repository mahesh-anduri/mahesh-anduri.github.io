import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Mahesh A - Senior UI & Full-Stack Developer' },
  {
    path: 'how-its-built',
    loadComponent: () => import('./pages/built.component').then(m => m.BuiltComponent),
    title: 'How this site is built - Mahesh A',
  },
  { path: '**', redirectTo: '' },
];
