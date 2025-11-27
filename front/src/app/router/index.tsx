import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@components/layout';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@features/auth';
import HomePage from '@features/bookmarks/pages/HomePage';
import BookmarksPage from '@features/bookmarks/pages/BookmarksPage';
import NewBookmarkPage from '@features/bookmarks/pages/NewBookmarkPage';
import EditBookmarkPage from '@features/bookmarks/pages/EditBookmarkPage';
import CollectionsPage from '@features/collections/pages/CollectionsPage';
import TagsPage from '@features/tags/pages/TagsPage';
import BackupPage from '@features/backup/pages/BackupPage';
import DesignSystemPage from '@features/bookmarks/pages/DesignSystemPage';
import Logo from '@assets/logo/dplus-logo.png';

const HomeIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BookmarkIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const FolderIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const TagIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);


/**
 * Itens de navegação do sidebar
 */
const BackupIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const sidebarItems = [
  { to: '/', label: 'Início', icon: <HomeIcon /> },
  { to: '/bookmarks', label: 'Bookmarks', icon: <BookmarkIcon /> },
  { to: '/collections', label: 'Coleções', icon: <FolderIcon /> },
  { to: '/tags', label: 'Tags', icon: <TagIcon /> },
  { to: '/backup', label: 'Backup', icon: <BackupIcon /> },
];

/**
 * Logo/Título do sidebar
 */
const SidebarHeader = () => (
  <div className="flex items-center gap-3">
    <img src={Logo} alt="D Plus Logo" className="h-8 w-8 object-contain shrink-0" />
    <div>
      <h2 className="font-display font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-50">
        Delicious+
      </h2>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Seus Bookmarks
      </p>
    </div>
  </div>
);


/**
 * Logo/Título do navbar
 */
const NavbarLeft = () => (
  <div className="flex items-center gap-2">
    <img src={Logo} alt="D Plus Logo" className="h-7 w-7 object-contain shrink-0" />
  </div>
);

export const router = createBrowserRouter([
  // Rotas públicas (não requerem autenticação)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/design-system',
    element: <DesignSystemPage />,
  },
  // Rotas privadas (requerem autenticação)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell
          sidebarItems={sidebarItems}
          sidebarHeader={<SidebarHeader />}
          navbarLeft={<NavbarLeft />}
        />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/bookmarks',
        element: <BookmarksPage />,
      },
      {
        path: '/bookmarks/new',
        element: <NewBookmarkPage />,
      },
      {
        path: '/bookmarks/:id/edit',
        element: <EditBookmarkPage />,
      },
      {
        path: '/collections',
        element: <CollectionsPage />,
      },
      {
        path: '/tags',
        element: <TagsPage />,
      },
      {
        path: '/backup',
        element: <BackupPage />,
      },
    ],
  },
]);
