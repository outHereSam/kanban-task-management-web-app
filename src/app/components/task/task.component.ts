import { Component, Input } from '@angular/core';
import { Task } from '../../models/board.model';
import { TaskDetailModalComponent } from '../task-detail-modal/task-detail-modal.component';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [TaskDetailModalComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.sass',
})
export class TaskComponent {
  @Input() task!: Task;
  completedSubtaskCount: number = 0;

  ngOnInit() {
    this.task.subtasks.map((subtask) => {
      if (subtask.isCompleted) this.completedSubtaskCount += 1;
    });
  }
}
