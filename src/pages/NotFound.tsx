import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Film, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <Film className="w-24 h-24 text-cinema-red mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-cinema-gold mb-4">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Oops! The page you're looking for seems to have vanished into the cinema darkness.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            variant="cinema"
            size="lg"
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
