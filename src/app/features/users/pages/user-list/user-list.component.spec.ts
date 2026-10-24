import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit contenir les composants app-page-card-wrapper et app-user-table', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('app-page-card-wrapper')).not.toBeNull();
        expect(compiled.querySelector('app-user-table')).not.toBeNull();
    });
});
