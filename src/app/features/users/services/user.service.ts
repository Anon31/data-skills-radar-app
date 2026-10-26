import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IUserDto, IUserPayload, IUserUpdatePasswordPayload } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/users`;

    // --- ÉTAT RÉACTIF (SIGNALS) ---
    private readonly _users = signal<IUserDto[]>([]);

    // Signal exposé en lecture seule aux composants
    public readonly users = this._users.asReadonly();

    constructor() {
        this.loadUsers();
    }

    /**
     * Charge ou rafraîchit la liste des utilisateurs et alimente le Signal users
     */
    loadUsers(): void {
        this.http.get<IUserDto[]>(this.apiUrl).subscribe({
            next: (users) => this._users.set(users),
            error: () => {
                // Erreur notifiée de manière centralisée par errorInterceptor
            },
        });
    }

    createUser(user: IUserPayload): Observable<IUserDto> {
        return this.http.post<IUserDto>(this.apiUrl, user).pipe(
            tap((createdUser: IUserDto) => {
                // Mise à jour optimiste du signal local
                this._users.update((users) => [createdUser, ...users]);
            }),
        );
    }

    getUserById(userId: string): Observable<IUserDto> {
        return this.http.get<IUserDto>(`${this.apiUrl}/${userId}`);
    }

    patchUser(id: string, user: Partial<IUserPayload>): Observable<IUserDto> {
        return this.http.patch<IUserDto>(`${this.apiUrl}/${id}`, user).pipe(
            tap((updatedUser: IUserDto) => {
                this._users.update((users) => users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)));
            }),
        );
    }

    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this._users.update((users) => users.filter((u) => u.id !== id));
            }),
        );
    }

    rollbackUserUpdate(index: number, originalUser: IUserDto): void {
        this._users.update((users) => {
            const newUsers = [...users];
            if (index >= 0 && index < newUsers.length) {
                newUsers[index] = originalUser;
            }
            return newUsers;
        });
    }

    updateMyPassword(payload: IUserUpdatePasswordPayload): Observable<{ message: string }> {
        return this.http.patch<{ message: string }>(`${this.apiUrl}/me/password`, payload);
    }
}
