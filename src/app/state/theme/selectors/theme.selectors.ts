import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThemeState } from '../theme.state';

export const selectThemeState = createFeatureSelector<ThemeState>('theme');
export const selectThemeMode = createSelector(
  selectThemeState,
  (state: ThemeState) => state.theme
);
