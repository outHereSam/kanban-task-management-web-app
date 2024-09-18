import { Component, Input } from '@angular/core';
import { BoardFormComponent } from '../../shared/board-form/board-form.component';
import { Board } from '../../models/board.model';
import { Store } from '@ngrx/store';
import { deleteBoard } from '../../state/boards/actions/boards.actions';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TaskFormComponent } from '../../shared/task-form/task-form.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BoardFormComponent, AsyncPipe, TaskFormComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
})
export class HeaderComponent {
  @Input() board!: Board;
  isFormOpened: boolean = false;
  // board$: Observable<Board | undefined>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {}

  toggleFormModal() {
    this.isFormOpened = !this.isFormOpened;
  }

  deleteBoard(id: number) {
    this.store.dispatch(deleteBoard({ id }));
    this.router.navigate(['']);
  }
}
