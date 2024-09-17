import { createAction, props } from '@ngrx/store';
import { Board } from '../../../models/board.model';

export const loadBoards = createAction('[Boards] Load Boards');
export const loadBoardSuccess = createAction(
  '[Boards] Load Boards Success',
  props<{ boards: Board[] }>()
);
export const loadBoardFailure = createAction(
  '[Boards] Load Boards Failure',
  props<{ error: string }>()
);
export const addBoard = createAction(
  '[Boards] Add Board',
  props<{ board: Board }>()
);
export const updateBoard = createAction(
  '[Boards] Update Board',
  props<{ board: Partial<Board> & { id: string } }>()
);
export const deleteBoard = createAction(
  '[Boards] Delete Board',
  props<{ id: string }>()
);
