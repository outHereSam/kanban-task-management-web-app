import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../../services/api.service';
import { LocalstorageService } from '../../../services/localstorage.service';
import { Store } from '@ngrx/store';
import {
  loadBoardsFailure,
  loadBoards,
  loadBoardsSuccess,
} from '../actions/boards.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class BoardEffect {
  constructor(
    private action$: Actions,
    private apiService: ApiService,
    private localStorageService: LocalstorageService,
    private store: Store
  ) {}

  loadBoards$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadBoards),
      mergeMap(() => {
        const boardsFromLocalStorage =
          this.localStorageService.getItemFromLocalStorage('boards');

        if (boardsFromLocalStorage) {
          return of(loadBoardsSuccess({ boards: boardsFromLocalStorage }));
        } else {
          return this.apiService.fetchData().pipe(
            map((boards) => {
              this.localStorageService.setItemInLocalStorage('boards', boards);
              return loadBoardsSuccess({ boards });
            }),
            catchError((error) =>
              of(loadBoardsFailure({ error: error.message }))
            )
          );
        }
      })
    )
  );
}
