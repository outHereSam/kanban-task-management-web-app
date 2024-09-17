import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBoard } from '../../state/boards/selectors/boards.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [AsyncPipe],
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
