import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Board } from '../../models/board.model';
import { TaskComponent } from '../task/task.component';
import { generateUniquePastelColor } from '../../utils/functions';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BoardFormComponent } from '../../shared/board-form/board-form.component';
import { Store } from '@ngrx/store';
import { selectBoard } from '../../state/boards/selectors/boards.selectors';

@Component({
  selector: 'app-board-content',
  standalone: true,
  imports: [TaskComponent, MatDialogModule],
  templateUrl: './board-content.component.html',
  styleUrl: './board-content.component.sass',
})
export class BoardContentComponent {
  @Input() board!: Board;
  colorList: string[] = [];
  dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.board.columns.forEach((column) =>
      this.colorList.push(generateUniquePastelColor())
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['board']) {
      // Re-run change detection explicitly when board input changes
      this.cdr.detectChanges();
    }
  }

  openBoardForm() {
    this.dialog.open(BoardFormComponent, {
      width: '480px',
      data: this.board,
    });
  }
}
