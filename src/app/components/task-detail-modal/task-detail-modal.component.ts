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
import { DeleteTaskModalComponent } from '../delete-task-modal/delete-task-modal.component';

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
export class TaskDetailModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<TaskDetailModalComponent>);
  taskData = inject(MAT_DIALOG_DATA);
  dialog = inject(MatDialog);
  board$: Observable<Board | undefined>;
  boardId: number = 0;

  completedSubtaskCount: number = 0;
  statuses: string[] = [];

  constructor(private store: Store) {
    this.board$ = this.store.select(selectBoard);
  }

  ngOnInit() {
    // console.log(this.taskData);
    this.board$.subscribe((board) => {
      if (board) {
        this.statuses = [];
        this.boardId = board.id;
        this.statuses = board.columns.map((column) => column.name);
      }
    });

    this.taskData.subtasks.forEach((subtask: Subtask) => {
      if (subtask.isCompleted) {
        this.completedSubtaskCount++;
      }
    });
  }

  openEditForm() {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '480px',
      data: this.taskData,
    });
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
    // console.log(this.taskData);
    const isCompleted = event.target.checked;
    const subtaskTitle = event.target.value;

    const updatedSubtask = this.taskData.subtasks.map((subtask: Subtask) => {
      if (subtask.title === subtaskTitle) {
        return {
          ...subtask,
          isCompleted: isCompleted,
        };
      }
      return subtask;
    });

    this.store.dispatch(
      updateSubtask({
        boardId: this.boardId,
        // columnName: this.taskData.status,
        task: {
          ...this.taskData,
          subtasks: updatedSubtask,
        },
      })
    );
  }

  // updateSubtask(event: any) {
  //   const isCompleted = event.target.checked;
  //   const subtaskTitle = event.target.value;

  //   const updatedSubtask = this.taskData.subtasks.map((subtask: Subtask) => {
  //     if (subtask.title === subtaskTitle) {
  //       return {
  //         ...subtask,
  //         isCompleted: isCompleted,
  //       };
  //     }
  //     return subtask;
  //   });

  //   this.store.dispatch(
  //     updateSubtask({
  //       boardId: this.boardId,
  //       // columnName: this.taskData.status,
  //       task: {
  //         ...this.taskData,
  //         subtasks: updatedSubtask,
  //       },
  //     })
  //   );
  //   console.log()
  // }

  openDeleteTaskModal() {
    this.dialog.open(DeleteTaskModalComponent, {
      width: '480px',
      data: {
        task: this.taskData,
        boardId: this.boardId,
      },
    });
    this.dialogRef.close();
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
}
