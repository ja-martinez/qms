import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export default function MainNav({
  className,
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link
        to="/dashboard"
        activeProps={{
          className: "text-primary",
        }}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
      <Link
        to="/display"
        activeProps={{
          className: "text-primary",
        }}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Display
      </Link>
      <Link
        to="/kiosk"
        activeProps={{
          className: "text-primary",
        }}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Kiosk
      </Link>
    </nav>
  );
}
