/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
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
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  // Per-route scroll memory: scrollTop saved by pathname so each tab keeps its place.
  const scrollPositions = useRef<Record<string, number>>({});
  const activePathRef = useRef(location.pathname);

  // Continuously remember the scroll position of whichever route is showing.
  // Depends on `user` so it (re)attaches once the shell actually renders post-auth.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      scrollPositions.current[activePathRef.current] = el.scrollTop;
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [user]);

  // On every route change, restore the remembered position (or jump to top on first visit).
  useLayoutEffect(() => {
    activePathRef.current = location.pathname;
    const el = scrollRef.current;
    if (!el) return;

    const target = scrollPositions.current[location.pathname] ?? 0;
    el.scrollTop = target;
    if (target <= 0) return; // nothing to chase

    // Tabs like Harga/Pesan/Akun re-fetch on mount and show a loading spinner
    // first, so the container isn't tall enough to reach `target` yet. Re-apply
    // each frame as the content grows — until it's reachable, the user takes
    // over, or a short time budget elapses.
    let rafId = 0;
    const start = performance.now();
    let interrupted = false;
    const stop = () => {
      interrupted = true;
    };
    el.addEventListener('wheel', stop, { passive: true, once: true });
    el.addEventListener('touchmove', stop, { passive: true, once: true });

    const step = () => {
      if (interrupted) return;
      const reachable = el.scrollHeight - el.clientHeight;
      el.scrollTop = Math.min(target, reachable);
      if (reachable < target && performance.now() - start < 1200) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('wheel', stop);
      el.removeEventListener('touchmove', stop);
    };
  }, [location.pathname]);

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
      <div ref={scrollRef} className="flex-1 flex flex-col overflow-y-auto">
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
      <div className="flex-1 flex flex-col overflow-y-auto bg-surface">
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
