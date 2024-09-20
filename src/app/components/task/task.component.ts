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
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [TaskDetailModalComponent, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task.component.html',
  styleUrl: './task.component.sass',
})
export class TaskComponent {
  @Input() task!: Task;
  completedSubtaskCount: number = 0;
  dialog = inject(MatDialog);

  ngOnInit() {
    this.task.subtasks.map((subtask) => {
      if (subtask.isCompleted) this.completedSubtaskCount += 1;
    });
  }

  openDialog() {
    this.dialog.open(TaskDetailModalComponent, {
      width: '480px',
      data: this.task,
    });
  }
}
