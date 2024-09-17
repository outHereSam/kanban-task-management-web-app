import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleTheme } from '../../state/theme/actions/theme.actions';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.sass',
})
export class ThemeToggleComponent {
  constructor(private store: Store) {}

  toggleTheme() {
    this.store.dispatch(toggleTheme());
  }
}
