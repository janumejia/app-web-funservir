import React, { useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from 'context/AuthProvider';
import Layout from 'containers/Layout/Layout';
import Loader from 'components/Loader/Loader';
import {
  HOME_PAGE,
  LISTING_POSTS_PAGE,
  SINGLE_POST_PAGE,
  LISTING_KEYPOINTS_PAGE,
  AGENT_PROFILE_PAGE,
  AGENT_PROFILE_FAVORITE,
  AGENT_PROFILE_CONTACT,
  PRICING_PLAN_PAGE,
  PRIVACY_PAGE,
  LOGIN_PAGE,
  REGISTRATION_PAGE,
  // REGISTRATION_PART_2_PROFILE_PAGE, // Importación ruta agregar más info - editar perfil
  // REGISTRATION_PART_2_IMAGE_EDIT_PAGE, // Importación ruta agregar más info - editar imagen perfil
  // REGISTRATION_PART_2_PASSWORD_CHANGE_PAGE, // Importación ruta agregar más info - cambiar password
  // REGISTRATION_PART_2_ACCOUNT_SETTINGS_PAGE, // Importación ruta agregar más info - banner lado izquierdo
  // REGISTRATION_SITE_OWNER_PAGE, // Importación ruta dueño de sitio
  FORGET_PASSWORD_PAGE,
  ADD_SITE_PAGE,
  EDIT_SITE_PAGE,
  ADD_KEY_POINT_PAGE,
  AGENT_IMAGE_EDIT_PAGE,
  AGENT_PASSWORD_CHANGE_PAGE,
  AGENT_ACCOUNT_SETTINGS_PAGE,
  REGISTRATION_USER,
  REGISTRATION_OWNER,
} from './settings/constant';

// protected route
function RequireAuth({ children }) {
  let { loggedIn, statusRequestDone } = useContext(AuthContext);
  let location = useLocation();
  if (statusRequestDone && !loggedIn) {
    return <Navigate to={LOGIN_PAGE} state={{ from: location }} />;
  }

  return children;
}

// public routes
const HomePage = React.lazy(() => import('containers/Home/Home'));
const ListingPage = React.lazy(() => import('containers/Listing/Listing'));
const SinglePageView = React.lazy(() =>
  import('containers/SinglePage/SinglePageView')
);
const ListingKeyPointsPage = React.lazy(() => import('containers/Listing/ListingKeyPoints'));
const AgentDetailsViewPage = React.lazy(() =>
  import('containers/Agent/AccountDetails/AgentDetailsViewPage')
);
const AgentItemLists = React.lazy(() =>
  import('containers/Agent/AccountDetails/AgentItemLists')
);
const AgentFavItemLists = React.lazy(() =>
  import('containers/Agent/AccountDetails/AgentFavItemLists')
);
const AgentContact = React.lazy(() =>
  import('containers/Agent/AccountDetails/AgentContact')
);
const PricingPage = React.lazy(() => import('containers/Pricing/Pricing'));
const PrivacyPage = React.lazy(() => import('containers/Privacy/Privacy'));
const SignInPage = React.lazy(() => import('containers/Auth/SignIn/SignIn'));
const SignUpPage = React.lazy(() => import('containers/Auth/SignUp/SignUp'));
const ForgetPasswordPage = React.lazy(() =>
  import('containers/Auth/ForgetPassword')
);
const SignUpUserPage = React.lazy(() => import('containers/Auth/SignUp/SignUpUser/AddUser')); // Registro de usuario - nuevo flujo
const SignUpOwnerPage = React.lazy(() => import('containers/Auth/SignUp/SignUpOwner/AddOwner')); // Registro de dueño de sitio - nuevo flujo

const NotFound = React.lazy(() => import('containers/404/404'));
// protected route
const AddListingPage = React.lazy(() =>
  import('containers/AddListing/AddListing')
);
const EditListingPage = React.lazy(() =>
  import('containers/EditListing/EditListing')
);
const AgentAccountSettingsPage = React.lazy(() =>
  import('containers/Agent/AccountSettings/AgentAccountSettingsPage')
);
const AgentCreateOrUpdateForm = React.lazy(() =>
  import('containers/Agent/AccountSettings/AgentCreateOrUpdateForm')
);
const AgentPictureChangeForm = React.lazy(() =>
  import('containers/Agent/AccountSettings/AgentPictureChangeForm')
);
const ChangePassWord = React.lazy(() =>
  import('containers/Agent/AccountSettings/ChangePassWordForm')
);
const AddKeyPointPage = React.lazy(() =>
  import('containers/AddKeyPoint/AddKeyPoint')
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={HOME_PAGE} element={<Layout />}>
        <Route
          index
          element={
            <React.Suspense fallback={<Loader />}>
              <HomePage />
            </React.Suspense>
          }
        />
        <Route
          path={LISTING_POSTS_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <ListingPage />
            </React.Suspense>
          }
        />
        <Route
          path={`${SINGLE_POST_PAGE}/:slug`}
          element={
            <React.Suspense fallback={<Loader />}>
              <SinglePageView />
            </React.Suspense>
          }
        />
        <Route
          path={LISTING_KEYPOINTS_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <ListingKeyPointsPage />
            </React.Suspense>
          }
        />
        {/* Nested routes for agent page */}
        <Route
          path={AGENT_PROFILE_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <RequireAuth>
                <AgentDetailsViewPage />
              </RequireAuth>
            </React.Suspense>
          }
        >
          <Route
            path={AGENT_PROFILE_PAGE}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentItemLists />
              </React.Suspense>
            }
          />
          <Route
            path={AGENT_PROFILE_FAVORITE}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentFavItemLists />
              </React.Suspense>
            }
          />
          <Route
            path={AGENT_PROFILE_CONTACT}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentContact />
              </React.Suspense>
            }
          />
        </Route>
        {/* end of Nested routes */}
        <Route
          path={PRICING_PLAN_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <PricingPage />
            </React.Suspense>
          }
        />
        <Route
          path={PRIVACY_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <PrivacyPage />
            </React.Suspense>
          }
        />
        <Route
          path={LOGIN_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <SignInPage />
            </React.Suspense>
          }
        />
        <Route
          path={REGISTRATION_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <SignUpPage />
            </React.Suspense>
          }
        />
        {/* Para la segunda página de registro normal */}
        <Route
          path={AGENT_ACCOUNT_SETTINGS_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <RequireAuth>
                <AgentAccountSettingsPage />
              </RequireAuth>
            </React.Suspense>
          }
        >
          <Route
            path={AGENT_ACCOUNT_SETTINGS_PAGE}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentCreateOrUpdateForm />
              </React.Suspense>
            }
          />
          <Route
            path={AGENT_IMAGE_EDIT_PAGE}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentPictureChangeForm />
              </React.Suspense>
            }
          />
          <Route
            path={AGENT_PASSWORD_CHANGE_PAGE}
            element={
              <React.Suspense fallback={<Loader />}>
                <ChangePassWord />
              </React.Suspense>
            }
          />
        </Route>
        {/* Fin - Segunda página de registro normal */}
        <Route
          path={FORGET_PASSWORD_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <ForgetPasswordPage />
            </React.Suspense>
          }
        />

        {/* FORMULARIO DE REGISTRO DE USUARIO NORMAL */}
        <Route
          path={REGISTRATION_USER}
          element={
            <React.Suspense fallback={<Loader />}>
              <SignUpUserPage />
            </React.Suspense>
          }
        />

        {/* FORMULARIO DE REGISTRO DE DUEÑO DE SITIO */}
        <Route
          path={REGISTRATION_OWNER}
          element={
            <React.Suspense fallback={<Loader />}>
              <SignUpOwnerPage />
            </React.Suspense>
          }
        />

        {/* Protected routes */}
        <Route
          path={ADD_SITE_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <RequireAuth>
                <AddListingPage />
              </RequireAuth>
            </React.Suspense>
          }
        />
        <Route
          path={EDIT_SITE_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <RequireAuth>
                <EditListingPage />
              </RequireAuth>
            </React.Suspense>
          }
        />
        <Route
          path={AGENT_ACCOUNT_SETTINGS_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <RequireAuth>
                <AgentAccountSettingsPage />
              </RequireAuth>
            </React.Suspense>
          }
        >
          <Route
            path={AGENT_ACCOUNT_SETTINGS_PAGE}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentCreateOrUpdateForm />
              </React.Suspense>
            }
          />
          <Route
            path={AGENT_IMAGE_EDIT_PAGE}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentPictureChangeForm />
              </React.Suspense>
            }
          />
          <Route
            path={AGENT_PASSWORD_CHANGE_PAGE}
            element={
              <React.Suspense fallback={<Loader />}>
                <ChangePassWord />
              </React.Suspense>
            }
          />
        </Route>
        <Route
          path={ADD_KEY_POINT_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <RequireAuth>
                <AddKeyPointPage />
              </RequireAuth>
            </React.Suspense>
          }
        />
        {/* end of Protected routes*/}
        <Route
          path="*"
          element={
            <React.Suspense fallback={<Loader />}>
              <NotFound />
            </React.Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
