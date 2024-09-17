import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Board } from '../../models/board.model';

export interface BoardState extends EntityState<Board> {
  boards: Board[];
  loading: boolean;
  error: string | null;
  selectedBoardId: string | null;
}

export const boardAdapter: EntityAdapter<Board> = createEntityAdapter<Board>({
  sortComparer: false,
});

export const initialState: BoardState = boardAdapter.getInitialState({
  boards: [],
  loading: false,
  error: null,
  selectedBoardId: null,
});
