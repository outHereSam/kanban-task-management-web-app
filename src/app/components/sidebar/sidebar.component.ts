import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllBoards } from '../../state/boards/selectors/boards.selectors';
import { Observable } from 'rxjs';
import { Board } from '../../models/board.model';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.sass',
})
export class SidebarComponent {
  boards$: Observable<Board[]> | undefined;

  constructor(private store: Store) {
    this.boards$ = this.store.select(selectAllBoards);
  }
}
