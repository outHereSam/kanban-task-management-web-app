import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  distinctUntilChanged,
  map,
  Observable,
  Subscription,
  combineLatest,
} from 'rxjs';
import { Board, Column, Subtask, Task } from '../../models/board.model';
import { Store } from '@ngrx/store';
import {
  selectBoard,
  selectTask,
} from '../../state/boards/selectors/boards.selectors';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import {
  deleteTask,
  updateSubtask,
  updateTaskStatus,
} from '../../state/boards/actions/boards.actions';
import { TaskFormComponent } from '../../shared/task-form/task-form.component';
import { AsyncPipe } from '@angular/common';
import { CdkMenuTrigger, CdkMenu } from '@angular/cdk/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [
    TaskFormComponent,
    MatDialogModule,
    AsyncPipe,
    CdkMenuTrigger,
    CdkMenu,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './task-detail-modal.component.html',
  styleUrl: './task-detail-modal.component.sass',
})
export class TaskDetailModalComponent implements OnInit, OnDestroy {
  private dialogRef = inject(MatDialogRef<TaskDetailModalComponent>);
  taskData = inject(MAT_DIALOG_DATA);
  dialog = inject(MatDialog);
  board$: Observable<Board | undefined>;
  boardId: number = 0;

  completedSubtaskCount: number = 0;
  statuses: string[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private store: Store) {
    this.board$ = this.store.select(selectBoard);
  }

  ngOnInit() {
    console.log(this.taskData);
    this.board$.subscribe((board) => {
      if (board) {
        this.statuses = [];
        this.boardId = board.id;
        this.statuses = board.columns.map((column) => column.name);
      }
    });
  }

  openEditForm() {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '480px',
      data: this.taskData,
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // Handle the result if needed
          // console.log(result);
        }
      })
    );
  }

  updateTaskStatus(event: any) {
    const newStatus = event.target.value;
    this.store.dispatch(
      updateTaskStatus({
        boardId: this.boardId,
        columnName: this.taskData.status,
        task: {
          ...this.taskData,
          status: newStatus,
        },
      })
    );
    this.dialogRef.close();
  }

  updateSubtask(event: any) {
    // console.log('Updating subtask:', event);
    const isCompleted = event.target.checked;
    const subtaskTitle = event.target.value;

    const updatedSubtasks = this.taskData.subtasks.map((subtask: Subtask) =>
      subtask.title === subtaskTitle ? { ...subtask, isCompleted } : subtask
    );

    this.store.dispatch(
      updateSubtask({
        boardId: this.boardId,
        task: {
          ...this.taskData,
          subtasks: updatedSubtasks,
        },
      })
    );
  }

  deleteTask() {
    this.store.dispatch(
      deleteTask({
        boardId: this.boardId,
        columnName: this.taskData.status,
        taskId: this.taskData.id,
      })
    );
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
