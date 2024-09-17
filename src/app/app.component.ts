import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadBoards } from './state/boards/actions/boards.actions';
import { Observable } from 'rxjs';
import { Board } from './models/board.model';
import { selectAllBoards } from './state/boards/selectors/boards.selectors';
import { AsyncPipe } from '@angular/common';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'kanban-task-management-web-app';

  constructor(private store: Store, private apiService: ApiService) {}

  ngOnInit() {
    this.store.dispatch(loadBoards());
  }
}
