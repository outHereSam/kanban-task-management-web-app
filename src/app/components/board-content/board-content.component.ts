import { Component, Input } from '@angular/core';
import { Board } from '../../models/board.model';
import { TaskComponent } from '../task/task.component';
import { generateUniquePastelColor } from '../../utils/functions';

@Component({
  selector: 'app-board-content',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './board-content.component.html',
  styleUrl: './board-content.component.sass',
})
export class BoardContentComponent {
  @Input() board!: Board;
  colorList: string[] = [];

  ngOnInit() {
    this.board.columns.forEach((column) =>
      this.colorList.push(generateUniquePastelColor())
    );
  }
}
