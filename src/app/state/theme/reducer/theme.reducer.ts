import { createReducer, on } from '@ngrx/store';
import { setTheme, toggleTheme } from '../actions/theme.actions';
import { initialThemeState } from '../../theme/theme.state';

export const themeReducer = createReducer(
  initialThemeState,
  on(toggleTheme, (state) => ({
    ...state,
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),
  on(setTheme, (state, { theme }) => ({ ...state, theme }))
);
