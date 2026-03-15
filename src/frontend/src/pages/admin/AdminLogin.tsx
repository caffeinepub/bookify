import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../../backend.d";
import { useActor } from "../../hooks/useActor";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsAdmin } from "../../hooks/useQueries";

export default function AdminLogin() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsAdmin();
  const { actor } = useActor();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (identity && isAdmin) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [identity, isAdmin, navigate]);

  const isLoggingIn = loginStatus === "logging-in";

  const handleClaimAdmin = async () => {
    if (!actor || !identity) return;
    setIsClaiming(true);
    try {
      await actor.assignCallerUserRole(identity.getPrincipal(), UserRole.admin);
      await queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    } catch (_err) {
      toast.error("Failed to claim admin access. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  const showClaimButton = identity && isAdmin === false && !isLoading;

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

        {isLoading && identity ? (
          <div
            data-ocid="admin.loading_state"
            className="flex justify-center mt-8"
          >
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : showClaimButton ? (
          <div className="mt-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <h2 className="font-semibold text-lg">Claim Admin Access</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              You are logged in but not yet an admin. Click below to claim admin
              access.
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={handleClaimAdmin}
              disabled={isClaiming}
              data-ocid="admin.claim_admin.button"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Claiming
                  Access...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Claim Admin Access
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-8">
              Sign in with Internet Identity to access the admin dashboard.
            </p>
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="admin.login.button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Sign In with Internet
                  Identity
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
