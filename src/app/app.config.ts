import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideHttpClient } from '@angular/common/http';
import { BoardEffects } from './state/boards/effects/boards.effects';
import { boardReducer } from './state/boards/reducer/boards.reducer';
import { themeReducer } from './state/theme/reducer/theme.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ThemeEffects } from './state/theme/effects/theme.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      router: routerReducer,
    }),
    provideState({
      name: 'boards',
      reducer: boardReducer,
    }),
    provideState({
      name: 'theme',
      reducer: themeReducer,
    }),
    provideEffects(BoardEffects, ThemeEffects),
    provideRouterStore(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
