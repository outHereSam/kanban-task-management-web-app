import { Component } from '@angular/core';
import { BoardFormComponent } from '../../shared/board-form/board-form.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BoardFormComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
})
export class HeaderComponent {}
