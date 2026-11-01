import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserCreateComponent } from './user-create.component';

describe('UserCreateComponent', () => {
    let component: UserCreateComponent;
    let fixture: ComponentFixture<UserCreateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserCreateComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), MessageService],
        }).compileComponents();

        fixture = TestBed.createComponent(UserCreateComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });
});
