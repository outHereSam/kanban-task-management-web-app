import { Component, Input } from '@angular/core';
import { Board } from '../../models/board.model';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-board-content',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './board-content.component.html',
  styleUrl: './board-content.component.sass',
})
export class BoardContentComponent {
  @Input() board!: Board;
}
