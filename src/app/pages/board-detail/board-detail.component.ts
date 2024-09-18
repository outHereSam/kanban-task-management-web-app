import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectBoard,
  selectBoardError,
  selectBoardLoading,
} from '../../state/boards/selectors/boards.selectors';
import { AsyncPipe } from '@angular/common';
import { BoardContentComponent } from '../../components/board-content/board-content.component';
import { TaskFormComponent } from '../../shared/task-form/task-form.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    BoardContentComponent,
    TaskFormComponent,
    HeaderComponent,
  ],
  templateUrl: './board-detail.component.html',
  styleUrl: './board-detail.component.sass',
})
export class BoardDetailComponent {
  board$ = this.store.select(selectBoard);
  loading$ = this.store.select(selectBoardLoading);
  error$ = this.store.select(selectBoardError);

  constructor(private store: Store) {}

  ngOnInit() {
    // this.board$.subscribe((board) => console.log(board));
  }
}
