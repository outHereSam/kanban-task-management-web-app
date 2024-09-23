import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Subtask, Task } from '../../models/board.model';
import { TaskDetailModalComponent } from '../task-detail-modal/task-detail-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectTask } from '../../state/boards/selectors/boards.selectors';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { updateSubtask } from '../../state/boards/actions/boards.actions';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [TaskDetailModalComponent, MatDialogModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task.component.html',
  styleUrl: './task.component.sass',
})
export class TaskComponent {
  // @Input() task!: Task;
  @Input() boardId!: number;
  @Input() columnName!: string;

  task$!: Observable<Task | undefined>;
  // completedSubtaskCount$!: Observable<number>;

  completedSubtaskCount: number = 0;

  constructor(private dialog: MatDialog, private store: Store) {}

  ngOnInit() {
    this.task$ = this.store.select(selectTask(this.boardId, this.columnName));
    // console.log(this.task);
  }

  getCompletedSubtaskCount(task: Task): number {
    return task.subtasks.filter((subtask) => subtask.isCompleted).length;
  }

  openDialog(task: Task) {
    this.dialog.open(TaskDetailModalComponent, {
      width: '480px',
      data: task,
    });
  }
}
