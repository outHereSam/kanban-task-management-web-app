import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Board } from '../../models/board.model';

export interface BoardState extends EntityState<Board> {
  selectedBoardId: number | null;
  loading: boolean;
  error: string | null;
}

export const boardAdapter: EntityAdapter<Board> = createEntityAdapter<Board>({
  selectId: (board: Board) => board.id,
  sortComparer: false,
});

export const initialBoardState: BoardState = boardAdapter.getInitialState({
  selectedBoardId: null,
  loading: false,
  error: null,
});
