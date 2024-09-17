import { createAction, props } from '@ngrx/store';
import { Board } from '../../../models/board.model';

export const loadBoards = createAction('[Boards] Load Boards');
export const loadBoardsSuccess = createAction(
  '[Boards] Load Boards Success',
  props<{ boards: Board[] }>()
);
export const loadBoardsFailure = createAction(
  '[Boards] Load Boards Failure',
  props<{ error: string }>()
);
export const addBoard = createAction(
  '[Boards] Add Board',
  props<{ board: Board }>()
);
export const updateBoard = createAction(
  '[Boards] Update Board',
  props<{ board: Partial<Board> & { id: number } }>()
);
export const deleteBoard = createAction(
  '[Boards] Delete Board',
  props<{ id: number }>()
);
