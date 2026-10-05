import { Routes } from '@angular/router';

export const mainLayoutRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'tableau-de-bord',
                pathMatch: 'full',
            },
            {
                path: 'tableau-de-bord',
                title: 'Tableau de bord - Data Skills Radar',
                loadComponent: () => import('./../features/home/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
            },
        ],
    },
];
