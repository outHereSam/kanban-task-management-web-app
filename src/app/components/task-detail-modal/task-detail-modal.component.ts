import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  distinctUntilChanged,
  map,
  Observable,
  Subscription,
  combineLatest,
} from 'rxjs';
import { Board, Subtask, Task } from '../../models/board.model';
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

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [
    TaskFormComponent,
    MatDialogModule,
    AsyncPipe,
    CdkMenuTrigger,
    CdkMenu,
  ],
  templateUrl: './task-detail-modal.component.html',
  styleUrl: './task-detail-modal.component.sass',
})
export class TaskDetailModalComponent implements OnInit, OnDestroy {
  private dialogRef = inject(MatDialogRef<TaskDetailModalComponent>);
  private taskData: Task & { boardId: number } = inject(MAT_DIALOG_DATA);
  dialog = inject(MatDialog);

  board$!: Observable<Board | undefined>;
  task$!: Observable<Task | undefined>;
  completedSubtaskCount$!: Observable<number>;
  statuses: string[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private store: Store) {}

  ngOnInit() {
    this.task$ = this.store.select(
      selectTask(this.taskData.id, this.taskData.status)
    );

    this.board$ = this.store.select(selectBoard);

    this.board$.subscribe((board) => {
      this.statuses = [];
      if (board) {
        this.statuses = board.columns.map((column) => column.name);
      }
    });

    this.completedSubtaskCount$ = this.task$.pipe(
      map(
        (task) =>
          task?.subtasks?.filter((subtask) => subtask.isCompleted).length ?? 0
      ),
      distinctUntilChanged()
    );

    this.subscription.add(
      this.task$.subscribe((updatedTask) => {
        if (updatedTask) {
          // console.log('Task updated:', updatedTask);
          this.taskData = { ...updatedTask, boardId: this.taskData.boardId };
        }
      })
    );
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
        boardId: this.taskData.boardId,
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

    // console.log('Dispatching updateSubtask action:', {
    //   boardId: this.taskData.boardId,
    //   task: {
    //     ...this.taskData,
    //     subtasks: updatedSubtasks,
    //   },
    // });

    this.store.dispatch(
      updateSubtask({
        boardId: this.taskData.boardId,
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
        boardId: this.taskData.boardId,
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
