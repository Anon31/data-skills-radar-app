import { IAuthUser, ILoginDto, ILoginPayload } from '../../features/auth/models/login.model';
import { computed, Injectable, signal, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RoleEnum } from '../enums/role.enum';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

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

    /**
     * Permet de se connecter en tant qu'invité (utilisateur "guest").
     * Cette méthode crée un utilisateur avec le rôle VISITOR et le stocke dans le localStorage.
     * Elle est utile pour permettre aux utilisateurs d'accéder à certaines fonctionnalités sans avoir besoin de créer un compte.
     */
    loginAsGuest(): void {
        const guestUser: IAuthUser = {
            id: 'guest',
            firstname: 'Invité',
            lastname: '',
            email: '',
            role: RoleEnum.VISITOR,
        };
        this.clearState();
        this.userConnectedSignal.set(guestUser);
        localStorage.setItem('USER_DATA', JSON.stringify(guestUser));
    }

    /**
     * Déconnecte l'utilisateur actuel.
     * Si un token est présent, il envoie une requête de déconnexion au backend.
     * Sinon, il effectue simplement la déconnexion côté client.
     */
    logout() {
        if (!this.tokenSignal()) {
            this.executeLogout();
            return;
        }
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
        } else if (userStr) {
            try {
                const user = JSON.parse(userStr) as IAuthUser;
                if (user?.role === RoleEnum.VISITOR) {
                    this.userConnectedSignal.set(user);
                    return;
                }
            } catch (e) {
                console.error('Erreur parsing guest user data', e);
            }
            this.clearState();
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
