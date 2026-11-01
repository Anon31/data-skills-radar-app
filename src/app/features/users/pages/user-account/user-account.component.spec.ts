import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserAccountComponent } from './user-account.component';

describe('UserAccountComponent', () => {
    let component: UserAccountComponent;
    let fixture: ComponentFixture<UserAccountComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserAccountComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), MessageService],
        }).compileComponents();

        fixture = TestBed.createComponent(UserAccountComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
