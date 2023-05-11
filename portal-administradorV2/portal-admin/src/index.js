import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
// import { Auth0Provider } from "@auth0/auth0-react";
import { GoogleOAuthProvider } from '@react-oauth/google';
// import { CookiesProvider } from "react-cookie";
import { AuthProvider } from './context/AuthProvider'
import { UncheckedSitesProvider } from './context/UncheckedSitesProvider'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <AuthProvider>
    <UncheckedSitesProvider>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENTID}>
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </UncheckedSitesProvider>
  </AuthProvider>

);
