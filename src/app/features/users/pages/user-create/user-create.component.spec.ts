import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreateComponent } from './user-create.component';

describe('UserCreateComponent', () => {
    let component: UserCreateComponent;
    let fixture: ComponentFixture<UserCreateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserCreateComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UserCreateComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });
});
