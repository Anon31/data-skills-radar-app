import { Routes } from '@angular/router';

export const mainLayoutRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'tableau-de-bord',
                pathMatch: 'full',
            },
            {
                path: 'tableau-de-bord',
                title: 'Tableau de bord',
                loadComponent: () => import('../features/home/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
            },
            // Les prochaines pages à créer :
            /*
            {
                path: 'matrice',
                loadComponent: () => import('../../pages/matrix/matrix.component').then(m => m.MatrixComponent)
            },
            {
                path: 'indicateurs',
                loadComponent: () => import('../../pages/macro/macro.component').then(m => m.MacroComponent)
            },
            {
                path: 'laboratoire',
                loadComponent: () => import('../../pages/lab/lab.component').then(m => m.LabComponent)
            }
            */
        ],
    },
];
