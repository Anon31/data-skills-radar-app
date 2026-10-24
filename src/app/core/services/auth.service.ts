import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAuthUser, ILoginDto, ILoginPayload } from '../../features/auth/models/login.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private jwtHelperService = new JwtHelperService();
    private httpClient = inject(HttpClient);
    private router = inject(Router);

    private tokenSignal = signal<string | null>(null);
    private userConnectedSignal = signal<IAuthUser | null>(null);

    readonly isAuthenticated = computed(() => {
        const token = this.tokenSignal();
        return !!token && !this.jwtHelperService.isTokenExpired(token);
    });

    readonly userConnected = computed(() => this.userConnectedSignal());

    constructor() {
        this.loadToken();
    }

    login(payload: ILoginPayload): Observable<HttpResponse<ILoginDto>> {
        return this.httpClient.post<ILoginDto>(`${environment.API_URL}/auth/login`, payload, { observe: 'response' }).pipe(
            tap((response) => {
                const body = response.body;
                if (body?.access_token) {
                    this.saveToken(body.access_token);
                    if (body.user) {
                        this.userConnectedSignal.set(body.user);
                        localStorage.setItem('USER_DATA', JSON.stringify(body.user));
                    }
                }
            }),
        );
    }

    logout() {
        this.httpClient.post(`${environment.API_URL}/auth/logout`, {}).subscribe({
            next: () => this.executeLogout(),
            error: () => this.executeLogout(),
        });
    }

    private executeLogout() {
        this.clearState();
        this.router.navigate(['/connexion']).then();
    }

    saveToken(jwt: string) {
        localStorage.setItem('JWT_TOKEN', jwt);
        this.tokenSignal.set(jwt);
    }

    getToken(): string | null {
        return this.tokenSignal();
    }

    loadToken(): void {
        const token = localStorage.getItem('JWT_TOKEN');
        const userStr = localStorage.getItem('USER_DATA');

        if (token && !this.jwtHelperService.isTokenExpired(token)) {
            this.tokenSignal.set(token);
            if (userStr) {
                try {
                    this.userConnectedSignal.set(JSON.parse(userStr));
                } catch (e) {
                    console.error('Erreur parsing user data', e);
                }
            }
        } else {
            this.clearState();
        }
    }

    isTokenExpired(): boolean {
        const token = this.tokenSignal();
        return !token || this.jwtHelperService.isTokenExpired(token);
    }

    private clearState(): void {
        localStorage.removeItem('JWT_TOKEN');
        localStorage.removeItem('USER_DATA');
        this.tokenSignal.set(null);
        this.userConnectedSignal.set(null);
    }
}
