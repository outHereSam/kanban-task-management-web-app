import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadBoards } from './state/boards/actions/boards.actions';
import { AsyncPipe } from '@angular/common';
import { ApiService } from './services/api.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { loadTheme } from './state/theme/actions/theme.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'kanban-task-management-web-app';

  constructor(private store: Store, private apiService: ApiService) {}

  ngOnInit() {
    this.store.dispatch(loadBoards());
    this.store.dispatch(loadTheme());
  }
}
