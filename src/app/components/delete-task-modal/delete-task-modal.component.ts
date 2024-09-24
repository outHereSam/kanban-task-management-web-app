import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectTask } from '../../state/boards/selectors/boards.selectors';
import { Task } from '../../models/board.model';
import { deleteTask } from '../../state/boards/actions/boards.actions';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-delete-task-modal',
  standalone: true,
  imports: [MatDialogModule, AsyncPipe],
  templateUrl: './delete-task-modal.component.html',
  styleUrl: './delete-task-modal.component.sass',
})
export class DeleteTaskModalComponent {
  taskData = inject(MAT_DIALOG_DATA);
  task$: Observable<Task | undefined>;

  constructor(private store: Store, private router: Router) {
    this.task$ = this.store.select(
      selectTask(this.taskData.task.id, this.taskData.task.status)
    );
  }

  ngOnInit() {
    this.task$ = this.store.select(
      selectTask(this.taskData.task.id, this.taskData.task.status)
    );
  }

  deleteTask() {
    this.store.dispatch(
      deleteTask({
        boardId: this.taskData.boardId,
        columnName: this.taskData.task.status,
        taskId: this.taskData.task.id,
      })
    );
    this.router.navigate(['']);
  }
}
