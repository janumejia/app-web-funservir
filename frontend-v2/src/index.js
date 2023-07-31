import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes/default.theme';
import GlobalStyles from 'themes/global.style';
import AuthProvider from 'context/AuthProvider';
import AppRoutes from './router';
import OtherVariablesProvider from 'context/OtherVariablesProvider';

const App = () => (
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <GlobalStyles />
      <BrowserRouter>
        <OtherVariablesProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </OtherVariablesProvider>
      </BrowserRouter>
    </React.Fragment>
  </ThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
