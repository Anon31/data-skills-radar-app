import { adminGuard } from '../core/guards/admin-guard';
import { userGuard } from '../core/guards/user-guard';
import { authGuard } from '../core/guards/auth-guard';
import { Routes } from '@angular/router';

export const mainLayoutRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
        canActivate: [authGuard], // 👈 Protège l'ensemble du layout
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
            {
                path: 'mon-compte',
                title: 'Mes paramètres utilisateur',
                canActivate: [userGuard],
                loadComponent: () => import('../features/users/pages/user-account/user-account.component').then((m) => m.UserAccountComponent),
            },
            {
                path: 'utilisateurs',
                title: 'Utilisateurs',
                canActivate: [adminGuard],
                loadComponent: () => import('../features/users/users.component').then((m) => m.UsersComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'rechercher',
                        pathMatch: 'full',
                    },
                    {
                        path: 'rechercher',
                        title: 'Rechercher un utilisateur',
                        loadComponent: () => import('../features/users/pages/user-list/user-list.component').then((m) => m.UserListComponent),
                    },
                    {
                        path: 'creer',
                        title: 'Créer un utilisateur',
                        loadComponent: () => import('../features/users/pages/user-create/user-create.component').then((m) => m.UserCreateComponent),
                    },
                    {
                        path: 'compte/:id',
                        title: 'Détails du compte utilisateur',
                        loadComponent: () =>
                            import('../features/users/pages/user-editing/user-editing.component').then((m) => m.UserEditingComponent),
                    },
                ],
            },
            // {
            //     path: 'configuration',
            //     canActivate: [adminGuard], // 👈 Protège spécifiquement la route
            //     loadComponent: () => import('../features/admin/pages/config/config.component').then((m) => m.ConfigComponent),
            // },
        ],
    },
];
