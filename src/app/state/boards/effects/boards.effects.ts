import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../../services/api.service';
import { LocalstorageService } from '../../../services/localstorage.service';
import { Store } from '@ngrx/store';
import {
  loadBoardsFailure,
  loadBoards,
  loadBoardsSuccess,
  addBoard,
  updateBoard,
  deleteBoard,
  addTask,
  updateTaskStatus,
  updateSubtask,
  deleteTask,
} from '../actions/boards.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { selectAllBoards } from '../selectors/boards.selectors';

@Injectable()
export class BoardEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private localStorageService: LocalstorageService,
    private store: Store
  ) {}

  loadBoards$ = createEffect(() =>
    this.actions$.pipe(
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

  updateLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          addBoard,
          updateBoard,
          deleteBoard,
          addTask,
          updateTaskStatus,
          updateSubtask,
          deleteTask
        ),
        switchMap(() =>
          this.store.select(selectAllBoards).pipe(
            tap((boards) => {
              this.localStorageService.setItemInLocalStorage('boards', boards);
            })
          )
        )
      ),
    { dispatch: false }
  );
}
