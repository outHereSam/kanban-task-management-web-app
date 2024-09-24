import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Board, Column, Task } from '../../models/board.model';
import { TaskComponent } from '../task/task.component';
import { generateUniquePastelColor } from '../../utils/functions';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { BoardFormComponent } from '../../shared/board-form/board-form.component';
import { Store } from '@ngrx/store';
import { selectBoard } from '../../state/boards/selectors/boards.selectors';
import {
  moveTask,
  reorderTasks,
} from '../../state/boards/actions/boards.actions';

@Component({
  selector: 'app-board-content',
  standalone: true,
  imports: [
    TaskComponent,
    MatDialogModule,
    CdkDropList,
    CdkDrag,
    DragDropModule,
  ],
  templateUrl: './board-content.component.html',
  styleUrl: './board-content.component.sass',
})
export class BoardContentComponent {
  @Input() board!: Board;
  colorList: string[] = [];
  dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  constructor(private store: Store) {}

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

  drop(event: CdkDragDrop<Task[]>) {
    const sourceColumn = this.board.columns.find(
      (col) => col.tasks === event.previousContainer.data
    );
    const destinationColumn = this.board.columns.find(
      (col) => col.tasks === event.container.data
    );

    if (!sourceColumn || !destinationColumn) {
      console.error('Could not find source or destination column');
      return;
    }

    if (event.previousContainer === event.container) {
      // Same column
      this.store.dispatch(
        reorderTasks({
          boardId: this.board.id,
          columnName: sourceColumn.name,
          previousIndex: event.previousIndex,
          currentIndex: event.currentIndex,
        })
      );
    } else {
      // Different column
      this.store.dispatch(
        moveTask({
          boardId: this.board.id,
          sourceColumnName: sourceColumn.name,
          destinationColumnName: destinationColumn.name,
          previousIndex: event.previousIndex,
          currentIndex: event.currentIndex,
        })
      );
    }

    // Update local state to reflect changes immediately
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
