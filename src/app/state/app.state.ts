import { BoardState } from './boards/board.state';
import { ThemeState } from './theme/theme.state';

export interface AppState {
  board: BoardState;
  theme: ThemeState;
}
