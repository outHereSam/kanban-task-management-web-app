import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllBoards } from '../../state/boards/selectors/boards.selectors';
import { Observable } from 'rxjs';
import { Board } from '../../models/board.model';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { BoardFormComponent } from '../../shared/board-form/board-form.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    ThemeToggleComponent,
    BoardFormComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.sass',
})
export class SidebarComponent {
  boards$: Observable<Board[]> | undefined;
  isFormOpened: boolean = false;

  constructor(private store: Store) {
    this.boards$ = this.store.select(selectAllBoards);
  }

  toggleFormModal() {
    this.isFormOpened = !this.isFormOpened;
  }
}
