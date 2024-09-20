import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleTheme } from '../../state/theme/actions/theme.actions';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { selectThemeMode } from '../../state/theme/selectors/theme.selectors';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MatSlideToggleModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.sass',
})
export class ThemeToggleComponent {
  themeMode!: string;
  constructor(private store: Store) {
    this.store
      .select(selectThemeMode)
      .subscribe((theme) => (this.themeMode = theme));
  }

  ngOnInit() {}

  toggleTheme() {
    this.store.dispatch(toggleTheme());
  }
}
