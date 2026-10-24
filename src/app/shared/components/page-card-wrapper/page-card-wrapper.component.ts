import { Component, input } from '@angular/core';
import { Divider } from 'primeng/divider';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-page-card-wrapper',
    imports: [Card, Divider],
    templateUrl: './page-card-wrapper.component.html',
    styleUrl: './page-card-wrapper.component.css',
})
export class PageCardWrapperComponent {
    title = input<string>('');
    icon = input<string>('');
    subtitle = input<string>('');
    hideDivider = input<boolean>(false);
}
