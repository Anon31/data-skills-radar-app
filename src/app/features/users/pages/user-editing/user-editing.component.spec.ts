import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserEditingComponent } from './user-editing.component';

describe('UserEditingComponent', () => {
    let component: UserEditingComponent;
    let fixture: ComponentFixture<UserEditingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserEditingComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), MessageService],
        }).compileComponents();

        fixture = TestBed.createComponent(UserEditingComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
