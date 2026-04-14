import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, LogOut, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/best-sellers", label: "Best Sellers" },
  { to: "/pickles", label: "Pickles" },
  { to: "/snacks", label: "Snacks" },
  { to: "/about", label: "About Us" },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const { isLoggedIn, username, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-3 py-3 sm:px-4">
        {/* Logo */}
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="truncate font-display text-base font-bold text-primary-foreground sm:text-lg md:text-2xl">
            80's Aunty's Kitchen
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-md px-4 py-2 font-body text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-maroon-light text-primary-foreground"
                  : "text-primary-foreground/80 hover:bg-maroon-light/50 hover:text-primary-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn && (
            <span className="hidden items-center gap-1 text-sm text-primary-foreground/80 md:flex">
              <User className="h-4 w-4" />
              {username}
            </span>
          )}

          <Link
            to="/cart"
            className="relative rounded-full p-2.5 text-primary-foreground transition-colors hover:bg-maroon-light"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {isLoggedIn && (
            <button
              onClick={logout}
              className="hidden rounded-md p-2 text-primary-foreground/80 transition-colors hover:bg-maroon-light hover:text-primary-foreground md:block"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}

          {/* Mobile toggle */}
          <button
            className="rounded-md p-2.5 text-primary-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-maroon-light bg-primary px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-md px-4 py-3 font-body text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-maroon-light text-primary-foreground"
                  : "text-primary-foreground/80 hover:bg-maroon-light/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="mt-2 flex w-full items-center gap-2 rounded-md px-4 py-3 text-sm text-primary-foreground/80 hover:bg-maroon-light/50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
