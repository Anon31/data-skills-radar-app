import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../features/auth/services/auth.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    const isPublicRoute = req.url.includes('/auth/login') || req.url.includes('/system/');

    if (!isPublicRoute) {
        const jwt = authService.getToken();
        if (jwt) {
            const reqWithToken = req.clone({
                setHeaders: { Authorization: `Bearer ${jwt}` },
            });
            return next(reqWithToken);
        }
    }

    return next(req);
};
