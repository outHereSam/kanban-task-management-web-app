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
  @Input() task!: Task;

  // task$!: Observable<Task | undefined>;
  // completedSubtaskCount$!: Observable<number>;

  completedSubtaskCount: number = 0;

  constructor(private dialog: MatDialog, private store: Store) {}

  ngOnInit() {
    // console.log(this.task);
    this.task.subtasks.forEach((subtask) => {
      if (subtask.isCompleted) {
        this.completedSubtaskCount++;
      }
    });
  }

  openDialog() {
    this.dialog.open(TaskDetailModalComponent, {
      width: '480px',
      data: this.task,
    });
  }
}
