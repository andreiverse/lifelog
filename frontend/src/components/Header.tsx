import { $api } from '@/lib/api'
import { Link } from '@tanstack/react-router';
import { ModeToggle } from './ModeToggle';
import { Target } from 'lucide-react';

export default function Header() {
  const security = $api.useQuery("get", "/api/security");

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">LifeLog</h1>
              <p className="text-xs text-muted-foreground">Track your journey</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            {security.data?.name && (
              <span className="text-sm text-muted-foreground">
                {security.data.name}
              </span>
            )}
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Auth check - show login if not authenticated */}
      {security.isPending && <div className="text-center p-4">Loading...</div>}
      {security.error?.status === 401 && (
        <div className="text-center p-8">
          <a
            href="http://localhost:5032/api/security/login?redirectUri=http://localhost:3000/"
            className="text-primary hover:underline"
          >
            Click to login with auth.andrei.vip
          </a>
        </div>
      )}
      {security.error && security.error.status !== 401 && (
        <div className="text-center p-4 text-destructive">
          Unknown error getting your info: {security.error.detail}
        </div>
      )}
    </>
  );
}
