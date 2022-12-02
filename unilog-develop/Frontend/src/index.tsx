import React from 'react';
import ReactDOM from 'react-dom';
import 'utils/momentInit';
import '@elastic/eui/dist/eui_theme_light.css';
import '@elastic/charts/dist/theme_light.css';
import './index.css';
import App from './App';

import { HashRouter } from 'react-router-dom';
import { GlobalStateProvider } from 'contexts/GlobalStateContext';
import { GlobalUIProvider } from 'contexts/GlobalUIContext';

/** false時可跳過後端相關驗證 */
const HAS_BACKEND = true;

ReactDOM.render(
  <GlobalStateProvider hasBackend={HAS_BACKEND}>
    <GlobalUIProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </GlobalUIProvider>
  </GlobalStateProvider>,
  document.getElementById('root')
);
