import Link from 'next/link';
import { verifySession } from '@/lib/session';
import { Button } from '@/components/ui/core'; // Using our UI core
import { logout } from '@/actions/auth';

export async function Navbar() {
  const session = await verifySession();

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold">F</div>
            <span className="text-xl font-bold tracking-tighter text-slate-900">FormatuSalud</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session?.userId ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-teal-600">
                Dashboard
              </Link>
              {/* Logout requires form for server action */}
              <form action={logout}>
                <Button variant="ghost" size="sm" type="button" onClick={() => { }}>
                  {/* We need a real submit button or just stick to simple form */}
                </Button>
                {/* Simplified for server component: */}
                <button type="submit" className="text-sm font-medium text-slate-700 hover:text-red-600">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-teal-600">
                Log in
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
