import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideHttpClient } from '@angular/common/http';
import { BoardEffects } from './state/boards/effects/boards.effects';
import { boardReducer } from './state/boards/reducer/boards.reducer';
import { themeReducer } from './state/theme/reducer/theme.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    provideState({
      name: 'boards',
      reducer: boardReducer,
    }),
    provideState({
      name: 'theme',
      reducer: themeReducer,
    }),
    provideEffects(BoardEffects),
    provideRouterStore(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
