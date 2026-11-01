import { IUserDto, IUserPayload, IUserUpdatePasswordPayload } from '../models/user.model';
import { environment } from '../../../../environments/environment';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/users`;

    // --- ÉTAT RÉACTIF (HTTP RESOURCE) ---
    public readonly usersResource = httpResource<IUserDto[]>(() => this.apiUrl, {
        defaultValue: [],
    });

    // Signaux exposés en lecture seule aux composants
    public readonly users = this.usersResource.value.asReadonly();
    public readonly isLoading = this.usersResource.isLoading;
    public readonly error = this.usersResource.error;

    /**
     * Force le rechargement de la liste des utilisateurs auprès du backend
     */
    refreshUsers(): void {
        this.usersResource.reload();
    }

    createUser(user: IUserPayload): Observable<IUserDto> {
        return this.http.post<IUserDto>(this.apiUrl, user).pipe(
            tap((createdUser: IUserDto) => {
                // Mise à jour optimiste de la ressource locale
                this.usersResource.update((users) => [createdUser, ...users]);
            }),
        );
    }

    getUserById(userId: string): Observable<IUserDto> {
        return this.http.get<IUserDto>(`${this.apiUrl}/${userId}`);
    }

    patchUser(id: string, user: Partial<IUserPayload>): Observable<IUserDto> {
        return this.http.patch<IUserDto>(`${this.apiUrl}/${id}`, user).pipe(
            tap((updatedUser: IUserDto) => {
                this.usersResource.update((users) => users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)));
            }),
        );
    }

    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this.usersResource.update((users) => users.filter((u) => u.id !== id));
            }),
        );
    }

    rollbackUserUpdate(index: number, originalUser: IUserDto): void {
        this.usersResource.update((users) => {
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
