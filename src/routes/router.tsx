import { AppProvider } from '@/context/app.context';
import { GroupCodeProvider } from '@/context/group-code';
import { CatalogPage } from '@/pages/CatalogPage';
import { DebugPage } from '@/pages/DebugPage';
import { LegacyPublicationOverviewPage } from '@/pages/LegacyPublicationOverviewPage';
import { ListenPage } from '@/pages/ListenPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PublicationPage } from '@/pages/PublicationPage';
import { PublicationWithoutVersionPage } from '@/pages/PublicationWithoutVersionPage';
import { QrPage } from '@/pages/QrPage';
import { ReadPage } from '@/pages/ReadPage';
import { ReadWithoutVersionPage } from '@/pages/ReadWithoutVersionPage';
import { ReaderPage } from '@/pages/ReaderPage';
import { SelectPassagePage } from '@/pages/SelectPassagePage';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { routes } from './routes';

function ErrorBoundary() {
  return <Navigate to="/not-found" />;
}

export const AppRouter = () => {
  return (
    <Router>
      <AppProvider>
        <GroupCodeProvider>
          <Routes>
            <Route
              path={routes.root.path}
              errorElement={<ErrorBoundary />}
            >
              <Route
                path={routes.root.path}
                element={<Navigate to={routes.catalog.path} />}
              />
              <Route
                path={routes.catalog.path}
                element={<CatalogPage />}
              />
              <Route
                path={routes.debug.path}
                element={<DebugPage />}
              />
              <Route
                path={routes.selectPassage.path}
                element={<SelectPassagePage />}
              />
              <Route
                path={routes.listen.path}
                element={<ListenPage />}
              />
              <Route
                path={routes.legacyPublicationOverview.path}
                element={<LegacyPublicationOverviewPage />}
              />
              <Route
                path={routes.publicationWithoutVersion.path}
                element={<PublicationWithoutVersionPage />}
              />
              <Route
                path={routes.publication.path}
                element={<PublicationPage />}
              />
              <Route
                path={routes.qr.path}
                element={<QrPage />}
              />
              <Route
                path={routes.read.path}
                element={<ReadPage />}
              />
              <Route
                path={routes.readWithoutVersion.path}
                element={<ReadWithoutVersionPage />}
              />
              <Route
                path={routes.reader.path}
                element={<ReaderPage />}
              />
              <Route
                path={routes.notFound.path}
                element={<NotFoundPage />}
              />
              <Route
                path="*"
                element={<Navigate to={routes.notFound.path} />}
              />
            </Route>
            <Route
              path={routes.signIn.path}
              element={<SignInPage />}
            />
            <Route
              path={routes.signUp.path}
              element={<SignUpPage />}
            />
          </Routes>
        </GroupCodeProvider>
      </AppProvider>
    </Router>
  );
};
