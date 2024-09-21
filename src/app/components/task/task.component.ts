import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Task } from '../../models/board.model';
import { TaskDetailModalComponent } from '../task-detail-modal/task-detail-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectTask } from '../../state/boards/selectors/boards.selectors';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [TaskDetailModalComponent, MatDialogModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task.component.html',
  styleUrl: './task.component.sass',
})
export class TaskComponent {
  task$: Observable<Task | undefined>;
  @Input() task!: Task;
  completedSubtaskCount$: Observable<number>;

  // completedSubtaskCount: number = 0;
  dialog = inject(MatDialog);

  constructor(private store: Store) {
    this.task$ = this.store.select(
      selectTask(this.task?.id, this.task?.status)
    );
    this.completedSubtaskCount$ = this.task$.pipe(
      map(
        (task) =>
          task?.subtasks?.filter((subtask) => subtask.isCompleted).length ?? 0
      ),
      distinctUntilChanged()
    );
  }

  ngOnInit() {
    // this.task.subtasks.map((subtask) => {
    //   if (subtask.isCompleted) this.completedSubtaskCount += 1;
    // });
    this.task$ = this.store.select(
      selectTask(this.task?.id, this.task?.status)
    );
    this.completedSubtaskCount$ = this.task$.pipe(
      map(
        (task) =>
          task?.subtasks?.filter((subtask) => subtask.isCompleted).length ?? 0
      ),
      distinctUntilChanged()
    );
  }

  openDialog() {
    this.dialog.open(TaskDetailModalComponent, {
      width: '480px',
      data: this.task,
    });
  }
}
