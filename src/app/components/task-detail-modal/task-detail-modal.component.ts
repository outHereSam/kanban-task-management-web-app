import { Component, inject, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [TaskFormComponent, MatDialogModule],
  templateUrl: './task-detail-modal.component.html',
  styleUrl: './task-detail-modal.component.sass',
})
export class TaskDetailModalComponent {
  dialog = inject(MatDialog);
  taskData = inject(MAT_DIALOG_DATA);

  @Input() task!: Task;
  board$: Observable<Board | undefined>;
  boardId!: number;
  statuses: string[] = [];
  isEditModalOpened: boolean = false;
  completedSubtaskCount: number = 0;
  private boardSubscription!: Subscription;

  constructor(private store: Store) {
    this.board$ = this.store.select(selectBoard);
  }

  openCreateForm() {
    this.dialog.open(TaskFormComponent, {
      width: '480px',
    });
  }

  openEditForm() {
    this.dialog.open(TaskFormComponent, {
      width: '480px',
      data: this.task,
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
  }

  updateTaskStatus(event: any) {
    const newStatus = event.target.value;

    this.store.dispatch(
      updateTaskStatus({
        boardId: this.boardId,
        columnName: this.task.status,
        task: {
          ...this.task,
          status: newStatus,
        },
      })
    );
  }

  updateSubtask(event: any) {
    const isCompleted = event.target.checked;
    const subtaskTitle = event.target.value;

    const updatedSubtask = this.taskData.task.subtasks.map(
      (subtask: Subtask) => {
        if (subtask.title === subtaskTitle) {
          return {
            ...subtask,
            isCompleted: isCompleted,
          };
        }
        return subtask;
      }
    );

    this.store.dispatch(
      updateSubtask({
        boardId: this.boardId,
        columnName: this.taskData.task.status,
        task: {
          ...this.taskData.task,
          subtasks: updatedSubtask,
        },
      })
    );
  }

  deleteTask(id: number) {
    this.store.dispatch(
      deleteTask({
        boardId: this.boardId,
        columnName: this.taskData.task.status,
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
