import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBoard } from '../../state/boards/selectors/boards.selectors';
import { AsyncPipe } from '@angular/common';
import { BoardContentComponent } from '../../components/board-content/board-content.component';
import { BoardFormComponent } from '../../shared/board-form/board-form.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [AsyncPipe, BoardContentComponent, BoardFormComponent],
  templateUrl: './board-detail.component.html',
  styleUrl: './board-detail.component.sass',
})
export class BoardDetailComponent {
  board$ = this.store.select(selectBoard);

  constructor(private store: Store) {}

  ngOnInit() {
    this.board$.subscribe((board) => console.log(board));
  }
}
