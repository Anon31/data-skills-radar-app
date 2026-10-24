import { environment } from '../../../environments/environment';
import { SystemStatus } from '../models/system-status.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SystemService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.API_URL}/system`;

    getSystemStatus(): Observable<SystemStatus> {
        return this.http.get<SystemStatus>(`${this.apiUrl}/status`);
    }
}
