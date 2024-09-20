import { Component, inject, Input } from '@angular/core';
import { distinctUntilChanged, map, Observable, Subscription } from 'rxjs';
import { Board, Subtask, Task } from '../../models/board.model';
import { Store } from '@ngrx/store';
import {
  selectBoard,
  selectTask,
} from '../../state/boards/selectors/boards.selectors';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import {
  deleteTask,
  updateSubtask,
  updateTaskStatus,
} from '../../state/boards/actions/boards.actions';
import { TaskFormComponent } from '../../shared/task-form/task-form.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [TaskFormComponent, MatDialogModule, AsyncPipe],
  templateUrl: './task-detail-modal.component.html',
  styleUrl: './task-detail-modal.component.sass',
})
export class TaskDetailModalComponent {
  dialog = inject(MatDialog);
  taskData = inject(MAT_DIALOG_DATA);

  @Input() task!: Task;
  board$: Observable<Board | undefined>;
  task$: Observable<Task | undefined>;
  columnName!: string;
  boardId!: number;
  statuses: string[] = [];
  isEditModalOpened: boolean = false;
  completedSubtaskCount$: Observable<number>;
  private boardSubscription!: Subscription;

  constructor(private store: Store) {
    this.board$ = this.store.select(selectBoard);
    this.task$ = this.store.select(
      selectTask(this.taskData.id, this.taskData.status)
    );
    this.completedSubtaskCount$ = this.task$.pipe(
      map(
        (task) =>
          task?.subtasks?.filter((subtask) => subtask.isCompleted).length ?? 0
      ),
      distinctUntilChanged()
    );
  }

  openCreateForm() {
    this.dialog.open(TaskFormComponent, {
      width: '480px',
    });
  }

  openEditForm() {
    this.dialog.open(TaskFormComponent, {
      width: '480px',
      data: this.taskData,
    });
  }

  ngOnInit() {
    this.boardSubscription = this.board$.subscribe((board) => {
      this.statuses = [];
      if (board) {
        this.boardId = board.id;
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
  }

  updateSubtask(event: any) {
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
        columnName: this.taskData.status,
        task: {
          ...this.taskData,
          subtasks: updatedSubtask,
        },
      })
    );
  }

  deleteTask(id: number) {
    this.store.dispatch(
      deleteTask({
        boardId: this.boardId,
        columnName: this.taskData.status,
        taskId: id,
      })
    );
  }

  toggleEditTask() {
    this.isEditModalOpened = !this.isEditModalOpened;
  }

  ngOnDestroy() {
    if (this.boardSubscription) {
      this.boardSubscription.unsubscribe();
    }
  }
}
