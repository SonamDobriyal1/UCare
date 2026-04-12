import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, ChevronDown, Users, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface NavDropdownItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  description: string;
}

interface NavDropdown {
  label: string;
  items: NavDropdownItem[];
}

interface NavLink {
  label: string;
  to: string;
}

type NavItem = NavLink | (NavDropdown & { dropdown: true });

const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Features", to: "/features" },
  { label: "Chatbot", to: "/chatbot" },
  {
    label: "Community",
    dropdown: true,
    items: [
      {
        label: "Community Forum",
        to: "/community",
        icon: <Users className="h-4 w-4 text-primary" />,
        description: "Connect, share stories and support each other",
      },
      {
        label: "Help & Resources",
        to: "/help",
        icon: <LifeBuoy className="h-4 w-4 text-primary" />,
        description: "Rehab centres, NGOs and helplines across India",
      },
    ],
  },
  { label: "Contact", to: "/contact" },
];

function isDropdown(item: NavItem): item is NavDropdown & { dropdown: true } {
  return "dropdown" in item && item.dropdown === true;
}

const DropdownMenu = ({
  item,
  location,
}: {
  item: NavDropdown & { dropdown: true };
  location: ReturnType<typeof useLocation>;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isActive = item.items.some((i) => location.pathname === i.to);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {item.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 rounded-xl border border-border bg-background shadow-lg ring-1 ring-black/5 z-50">
          <div className="p-1.5">
            {item.items.map((sub) => (
              <Link
                key={sub.to}
                to={sub.to}
                onClick={() => setOpen(false)}
                className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted ${
                  location.pathname === sub.to ? "bg-primary/10" : ""
                }`}
              >
                <span className="mt-0.5 shrink-0">{sub.icon}</span>
                <span>
                  <span
                    className={`block text-sm font-medium ${
                      location.pathname === sub.to
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {sub.label}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {sub.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();
  const { token, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <Heart className="h-6 w-6 text-primary" fill="hsl(174, 42%, 41%)" />
          <span className="text-xl font-serif font-semibold tracking-tight">UCare</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
            isDropdown(item) ? (
              <DropdownMenu key={item.label} item={item} location={location} />
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.to
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {token ? (
            <>
              <Button size="sm" variant="outline" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4">
          {navItems.map((item) => {
            if (isDropdown(item)) {
              const isExpanded = mobileExpanded === item.label;
              const isActive = item.items.some(
                (i) => location.pathname === i.to
              );
              return (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setMobileExpanded(isExpanded ? null : item.label)
                    }
                    className={`flex w-full items-center justify-between py-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="ml-3 border-l border-border pl-3 pb-1">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          onClick={() => {
                            setOpen(false);
                            setMobileExpanded(null);
                          }}
                          className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary ${
                            location.pathname === sub.to
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {sub.icon}
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.to
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {token && (
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/dashboard"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
          )}
          {token ? (
            <Button size="sm" className="mt-2 w-full" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button size="sm" className="mt-2 w-full" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
