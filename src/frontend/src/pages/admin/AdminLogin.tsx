import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Loader2, LogIn } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsAdmin } from "../../hooks/useQueries";

export default function AdminLogin() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity && isAdmin) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [identity, isAdmin, navigate]);

  const isLoggingIn = loginStatus === "logging-in";

  return (
    <main className="min-h-screen flex items-center justify-center bg-primary">
      <div
        className="bg-card rounded-2xl shadow-2xl p-10 w-full max-w-md text-center"
        data-ocid="admin.login.panel"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <BookOpen className="h-8 w-8 text-accent" />
          <span className="font-display text-3xl font-bold text-primary">
            Bookify
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground mb-8">
          Sign in with Internet Identity to access the admin dashboard.
        </p>

        {isLoading && identity ? (
          <div data-ocid="admin.loading_state" className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="admin.login.button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Sign In with Internet
                Identity
              </>
            )}
          </Button>
        )}
      </div>
    </main>
  );
}
