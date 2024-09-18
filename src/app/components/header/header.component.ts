import { Component, Input } from '@angular/core';
import { BoardFormComponent } from '../../shared/board-form/board-form.component';
import { Board } from '../../models/board.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BoardFormComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
})
export class HeaderComponent {
  @Input() board!: Board;
  isFormOpened: boolean = false;

  toggleFormModal() {
    this.isFormOpened = !this.isFormOpened;
  }
}
