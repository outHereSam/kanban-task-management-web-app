import { Component, Input } from '@angular/core';
import { BoardFormComponent } from '../../shared/board-form/board-form.component';
import { Board } from '../../models/board.model';
import { Store } from '@ngrx/store';
import { deleteBoard } from '../../state/boards/actions/boards.actions';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TaskFormComponent } from '../../shared/task-form/task-form.component';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    BoardFormComponent,
    AsyncPipe,
    TaskFormComponent,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
})
export class HeaderComponent {
  @Input() board!: Board;
  isFormOpened: boolean = false;
  isOptionsOpened: boolean = false;
  // board$: Observable<Board | undefined>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {}

  toggleFormModal() {
    this.isFormOpened = !this.isFormOpened;
  }

  toggleOptions() {
    this.isOptionsOpened = !this.isOptionsOpened;
  }

  deleteBoard(id: number) {
    this.store.dispatch(deleteBoard({ id }));
    this.router.navigate(['']);
  }
}
