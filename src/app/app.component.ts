import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadBoards } from './state/boards/actions/boards.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'kanban-task-management-web-app';

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadBoards());
  }
}
