import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom, map } from 'rxjs/operators';
import { loadTheme, toggleTheme, setTheme } from '../actions/theme.actions';
import { LocalstorageService } from '../../../services/localstorage.service';

@Injectable()
export class ThemeEffects {
  constructor(
    private actions$: Actions,
    private localstorageService: LocalstorageService
  ) {}

  toggleTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleTheme),
        tap(() => {
          const currrentTheme =
            this.localstorageService.getItemFromLocalStorage('theme');
          const newTheme = currrentTheme === 'light' ? 'dark' : 'light';
          this.localstorageService.setItemInLocalStorage('theme', newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
        })
      ),
    { dispatch: false }
  );

  loadTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTheme),
      map(() => {
        const currrentTheme =
          this.localstorageService.getItemFromLocalStorage('theme');
        if (currrentTheme === null) {
          this.localstorageService.setItemInLocalStorage('theme', 'light');
          const theme = 'light';
          document.documentElement.setAttribute('data-theme', theme);

          return setTheme({ theme });
        } else {
          const theme = currrentTheme;
          document.documentElement.setAttribute('data-theme', theme);
          return setTheme({ theme });
        }
      })
    )
  );
}
