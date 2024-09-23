import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  selectBoard,
  selectBoardError,
  selectBoardLoading,
} from '../../state/boards/selectors/boards.selectors';
import { AsyncPipe } from '@angular/common';
import { BoardContentComponent } from '../../components/board-content/board-content.component';
import { HeaderComponent } from '../../components/header/header.component';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    BoardContentComponent,
    HeaderComponent,
    SidenavComponent,
    MatSidenavModule,
    MatButtonModule,
  ],
  templateUrl: './board-detail.component.html',
  styleUrl: './board-detail.component.sass',
})
export class BoardDetailComponent {
  board$ = this.store.select(selectBoard);
  loading$ = this.store.select(selectBoardLoading);
  error$ = this.store.select(selectBoardError);

  constructor(private store: Store) {}

  ngOnInit() {
    // this.board$.subscribe((board) => console.log(board));
  }
}
