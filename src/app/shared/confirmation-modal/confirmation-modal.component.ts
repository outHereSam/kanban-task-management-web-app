import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Board } from '../../models/board.model';
import { Store } from '@ngrx/store';
import { selectBoard } from '../../state/boards/selectors/boards.selectors';
import { AsyncPipe } from '@angular/common';
import { deleteBoard } from '../../state/boards/actions/boards.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [MatDialogModule, AsyncPipe],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.sass',
})
export class ConfirmationModalComponent {
  boardId = inject(MAT_DIALOG_DATA);
  board$: Observable<Board | undefined>;

  constructor(private store: Store, private router: Router) {
    this.board$ = this.store.select(selectBoard);
  }

  ngOnInit() {
    this.board$ = this.store.select(selectBoard);
  }

  deleteBoard() {
    this.store.dispatch(deleteBoard({ id: this.boardId }));
    this.router.navigate(['']);
  }
}
