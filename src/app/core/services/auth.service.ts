import { IAuthUser, ILoginDto, ILoginPayload } from '../../features/auth/models/login.model';
import { IUserDto, Role } from '../../features/users/models/user.model';
import { Observable, delay, of, throwError } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    // On injecte le SessionService pour persister l'utilisateur
    private readonly sessionService = inject(SessionService);

    // On expose l'utilisateur via le SessionService
    public readonly userConnected = this.sessionService.currentUser;

    /**
     * Simulation d'un appel réseau pour la connexion
     * @param payload Les identifiants du formulaire
     */
    public login(payload: ILoginPayload): Observable<{ body: ILoginDto }> {
        // 1. Simulation d'une base de données locale pour tester les 3 rôles
        const mockDb: Record<string, { role: Role; firstname: string; lastname: string }> = {
            'admin@dsr.fr': { role: 'ADMIN', firstname: 'Architecte', lastname: 'Système' },
            'user@dsr.fr': { role: 'USER', firstname: 'Client', lastname: 'Premium' },
            'visitor@dsr.fr': { role: 'VISITOR', firstname: 'Explorateur', lastname: 'Curieux' },
        };

        const userFound = mockDb[payload.email];

        // 2. Simulation d'une erreur si l'email n'est pas dans notre "base"
        if (!userFound) {
            return throwError(() => new Error('Identifiants incorrects')).pipe(delay(800));
        }

        // 3. Création du faux Token et de l'utilisateur
        const mockAuthUser: IAuthUser = {
            id: Math.floor(Math.random() * 1000),
            email: payload.email,
            firstname: userFound.firstname,
            lastname: userFound.lastname,
            role: userFound.role,
        };

        // Mise à jour de la session
        this.sessionService.setCurrentUser(mockAuthUser as IUserDto);

        // 4. On retourne la réponse formatée avec un délai simulé de 800ms
        const response: ILoginDto = {
            access_token: 'fake-jwt-token-12345',
            message: 'Connexion réussie',
            user: mockAuthUser,
        };

        return of({ body: response }).pipe(delay(800));
    }

    public logout(): void {
        this.sessionService.clearSession();
    }
}
