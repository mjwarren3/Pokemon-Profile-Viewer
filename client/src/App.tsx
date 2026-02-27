import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";

import { NavBar } from "@/components/layout/NavBar";
import { LoadingScreen } from "@/components/ui/Loading";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Favorites from "@/pages/Favorites";
import Profile from "@/pages/Profile";
import { useEffect } from "react";
import mixpanel from "mixpanel-browser";

function AppRoutes() {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user?.id) {
      mixpanel.identify(user.id); // stable backend user id
      mixpanel.people.set({
        $email: user.email ?? undefined,
        $first_name: user.firstName ?? undefined,
        $last_name: user.lastName ?? undefined,
      });
    } else {
      mixpanel.reset(); // clear identity on logged-out state
    }
  }, [
    isLoading,
    isAuthenticated,
    user?.id,
    user?.email,
    user?.firstName,
    user?.lastName,
  ]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/pokemon/:id" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
