import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom, map } from 'rxjs/operators';
import { loadTheme, toggleTheme, setTheme } from '../actions/theme.actions';
import { selectThemeMode } from '../selectors/theme.selectors';

@Injectable()
export class ThemeEffects {
  constructor(private actions$: Actions, private store: Store) {}

  persistTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleTheme, setTheme),
        withLatestFrom(this.store.select(selectThemeMode)),
        tap(([action, mode]) => {
          localStorage.setItem('themeMode', mode);
        })
      ),
    { dispatch: false }
  );

  loadTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTheme),
      map(() => {
        const savedMode = localStorage.getItem('themeMode') as
          | 'light'
          | 'dark'
          | null;
        if (savedMode) {
          return setTheme({ mode: savedMode });
        }
        return { type: 'NOOP' };
      })
    )
  );
}
