import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading, hasCompletedQuestionnaire } = useAuth();
  const [location] = useLocation();

  // If still loading auth state, show loading spinner
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If not logged in, redirect to the auth page
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // If logged in but hasn't completed questionnaire yet, and not already on questionnaire page
  if (!hasCompletedQuestionnaire && path !== "/questionnaire" && !location.includes("/questionnaire")) {
    return (
      <Route path={path}>
        <Redirect to="/questionnaire" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
