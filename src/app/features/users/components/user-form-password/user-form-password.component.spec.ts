import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserFormPasswordComponent } from './user-form-password.component';

describe('UserFormPasswordComponent', () => {
    let component: UserFormPasswordComponent;
    let fixture: ComponentFixture<UserFormPasswordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserFormPasswordComponent],
            providers: [{ provide: DynamicDialogRef, useValue: { close: () => {} } }],
        }).compileComponents();

        fixture = TestBed.createComponent(UserFormPasswordComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
