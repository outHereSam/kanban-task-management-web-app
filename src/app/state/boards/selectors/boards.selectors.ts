import { createFeatureSelector, createSelector } from '@ngrx/store';
import { boardAdapter, BoardState } from '../board.state';
import { selectRouteParams } from '../../router.selectors';

export const selectBoardState = createFeatureSelector<BoardState>('boards');

export const {
  selectAll: selectAllBoards,
  selectEntities: selectBoardEntities,
  selectIds: selectBoardIds,
  selectTotal: selectTotalBoards,
} = boardAdapter.getSelectors(selectBoardState);

// Select a single board
export const selectBoardById = (id: number) =>
  createSelector(selectBoardEntities, (entities) => entities[id]);

export const selectBoard = createSelector(
  selectBoardEntities,
  selectRouteParams,
  (boards, params) => {
    const id = params['id'];
    return id ? boards[id] : undefined;
  }
);

export const selectFirstBoardId = createSelector(
  selectBoardIds,
  (ids) => ids[0] || null
);

export const selectNextId = createSelector(selectBoardIds, (ids) =>
  ids.length > 0 ? Math.max(...(ids as number[])) + 1 : -1
);

export const selectStatusById = (id: number) =>
  createSelector(selectBoardEntities, (entities) =>
    entities[id]?.columns.map((c) => c.name)
  );

export const selectBoardLoading = createSelector(
  selectBoardState,
  (state: BoardState) => state.loading
);
export const selectBoardError = createSelector(
  selectBoardState,
  (state: BoardState) => state.error
);
