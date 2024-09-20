import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  selectAllBoards,
  selectBoard,
} from '../../state/boards/selectors/boards.selectors';
import { Observable } from 'rxjs';
import { Board } from '../../models/board.model';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { BoardFormComponent } from '../../shared/board-form/board-form.component';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    ThemeToggleComponent,
    BoardFormComponent,
    MatDialogModule,
    MatDialogContent,
    MatDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.sass',
})
export class SidebarComponent {
  boards$: Observable<Board[]> | undefined;
  isFormOpened: boolean = false;
  activeBoard$: Observable<Board | undefined>;

  constructor(private store: Store) {
    this.boards$ = this.store.select(selectAllBoards);
    this.activeBoard$ = this.store.select(selectBoard);
  }

  toggleFormModal() {
    this.isFormOpened = !this.isFormOpened;
  }
}
