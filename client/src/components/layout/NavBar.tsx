import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Heart, Search, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/pokemon-helpers";

export function NavBar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-rose-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <div className="w-3 h-3 bg-white rounded-full border-2 border-primary/20" />
            </div>
            <span className="font-display font-black text-xl tracking-tight text-foreground">
              Poké<span className="text-primary">Dex</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-4">
            <Link 
              href="/"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all",
                location === "/" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Browse</span>
            </Link>
            
            <Link 
              href="/favorites"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all",
                location === "/favorites" 
                  ? "bg-rose-500/10 text-rose-500" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>

            <div className="h-6 w-px bg-border mx-2" />

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-foreground">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Trainer'}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors tooltip-trigger"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
