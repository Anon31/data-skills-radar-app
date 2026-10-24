import { Component } from '@angular/core';
import { UserTableComponent } from '../../components/user-table/user-table.component';
import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';

@Component({
    imports: [UserTableComponent, PageCardWrapperComponent],
    selector: 'app-user-list',
    styleUrl: './user-list.component.css',
    templateUrl: './user-list.component.html',
})
export class UserListComponent {}
