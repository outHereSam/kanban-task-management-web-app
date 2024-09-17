import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom, map } from 'rxjs/operators';
import { loadTheme, toggleTheme, setTheme } from '../actions/theme.actions';
import { selectThemeMode } from '../selectors/theme.selectors';
import { LocalstorageService } from '../../../services/localstorage.service';

@Injectable()
export class ThemeEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private localstorageService: LocalstorageService
  ) {}

  persistTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleTheme, setTheme),
        withLatestFrom(this.store.select(selectThemeMode)),
        tap(([action, mode]) => {
          this.localstorageService.setItemInLocalStorage('themeMode', mode);
        })
      ),
    { dispatch: false }
  );

  loadTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTheme),
      map(() => {
        const savedMode = this.localstorageService.getItemFromLocalStorage(
          'themeMode'
        ) as 'light' | 'dark' | null;
        if (savedMode) {
          return setTheme({ mode: savedMode });
        }
        return { type: 'NOOP' };
      })
    )
  );
}
