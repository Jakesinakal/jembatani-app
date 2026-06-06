/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useOutletContext,
} from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

// Layout and Common UI
import { SafeArea } from '@/components/layout/SafeArea';
import { BottomNav } from '@/components/layout/BottomNav';

// Auth
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Feature screens
import Splash from '@/features/auth/Splash';
import Onboarding from '@/features/auth/Onboarding';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import Beranda from '@/features/feed/Beranda';
import Harga from '@/features/prices/Harga';
import HargaDetail from '@/features/prices/HargaDetail';
import Pesan from '@/features/messages/Pesan';
import ChatDetail from '@/features/messages/ChatDetail';
import Akun from '@/features/profile/Akun';
import CreateListing from '@/features/feed/CreateListing';

// Hooks, types, and routes
import { useFeedPosts } from '@/features/feed/useFeedPosts';
import { ROUTES } from '@/lib/routes';
import { Post } from '@/types/post';

// Shared Context typing
export interface AppShellContext {
  posts: Post[];
  postsLoading: boolean;
  refetchPosts: () => void;
  onLikePost: (postId: string) => void;
}

function AppShell() {
  const { user, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading, refetch, handleLikePost } = useFeedPosts();

  if (authLoading) return null;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

  const contextValue: AppShellContext = {
    posts,
    postsLoading,
    refetchPosts: refetch,
    onLikePost: handleLikePost,
  };

  return (
    <SafeArea>
      <div className="flex-1 flex flex-col min-h-screen">
        <Outlet context={contextValue} />
      </div>
      <BottomNav />
    </SafeArea>
  );
}

function AuthShell() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to={ROUTES.BERANDA} replace />;

  return (
    <SafeArea>
      <div className="flex-1 flex flex-col min-h-screen bg-surface">
        <Outlet />
      </div>
    </SafeArea>
  );
}

// Router instantiation representing createBrowserRouter and step redirections
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.SPLASH} replace />,
  },
  {
    element: <AuthShell />,
    children: [
      { path: 'splash', element: <Splash /> },
      { path: 'onboarding', element: <Onboarding /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    element: <AppShell />,
    children: [
      {
        path: 'beranda',
        element: <BerandaWrapper />,
      },
      {
        path: 'harga',
        element: <Harga />,
      },
      {
        path: 'harga/:commodityId',
        element: <HargaDetail />,
      },
      {
        path: 'pesan',
        element: <Pesan />,
      },
      {
        path: 'pesan/:chatId',
        element: <ChatDetail />,
      },
      {
        path: 'akun',
        element: <AkunWrapper />,
      },
      {
        path: 'post/create',
        element: <CreateListingWrapper />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.SPLASH} replace />,
  },
]);

// Wrapper component to pipe Context props safely
function BerandaWrapper() {
  const { posts, postsLoading, onLikePost } = useOutletContext<AppShellContext>();
  return <Beranda posts={posts} postsLoading={postsLoading} onLikePost={onLikePost} />;
}

function AkunWrapper() {
  return <Akun />;
}

function CreateListingWrapper() {
  const { refetchPosts } = useOutletContext<AppShellContext>();
  return <CreateListing refetchPosts={refetchPosts} />;
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Analytics />
    </AuthProvider>
  );
}
