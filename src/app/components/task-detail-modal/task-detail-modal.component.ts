import { Component, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Board, Task } from '../../models/board.model';
import { Store } from '@ngrx/store';
import {
  selectBoard,
  selectTask,
} from '../../state/boards/selectors/boards.selectors';
import { updateTask } from '../../state/boards/actions/boards.actions';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [],
  templateUrl: './task-detail-modal.component.html',
  styleUrl: './task-detail-modal.component.sass',
})
export class TaskDetailModalComponent {
  @Input() task!: Task;
  board$: Observable<Board | undefined>;
  boardId!: number;
  statuses: string[] = [];
  private boardSubscription!: Subscription;

  constructor(private store: Store) {
    this.board$ = this.store.select(selectBoard);
  }

  ngOnInit() {
    this.boardSubscription = this.board$.subscribe((board) => {
      this.statuses = [];
      if (board) {
        this.boardId = board.id;
        this.statuses = board.columns.map((column) => column.name);
      }
    });
  }

  updateSubtask(boardId: number, columnName: string, task: Task) {
    this.store.dispatch(updateTask({ boardId, columnName, task }));
  }
}
