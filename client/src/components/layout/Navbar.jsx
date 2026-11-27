import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Menu,
  X,
  ArrowUpRight,
  Zap,
  LogOut,
  UserRound,
  Sun,
  Moon,
} from "lucide-react";

import { useAuth } from "@/context/useAuth";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function ThemeToggle({ mobile = false, theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`flex items-center justify-center rounded-full border border-border transition-all duration-300 hover:bg-secondary ${
        mobile ? "size-11 rounded-xl" : "size-10"
      }`}
    >
      {theme === "dark" ? (
        <Sun className="size-[18px] text-primary" />
      ) : (
        <Moon className="size-[18px]" />
      )}
    </button>
  );
}

function AuthActions({
  mobile = false,
  status,
  user,
  onLogout,
  onCloseMobileMenu,
}) {
  if (status === "loading") {
    return (
      <span className="text-sm text-muted-foreground">
        Loading...
      </span>
    );
  }

  if (user) {
    return (
      <>
        <span
          className={`flex items-center gap-2 text-sm font-semibold text-foreground ${
            mobile ? "justify-center py-2" : ""
          }`}
        >
          <UserRound className="size-4" />
          {user.username.replace(/user$/, "")}
        </span>

        <button
          type="button"
          onClick={onLogout}
          className={`flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:bg-secondary ${
            mobile ? "w-full rounded-xl" : ""
          }`}
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </>
    );
  }

  return (
    <>
      <Link
        to="/login"
        onClick={mobile ? onCloseMobileMenu : undefined}
        className={`text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground ${
          mobile
            ? "rounded-xl border border-border px-4 py-3 text-center"
            : ""
        }`}
      >
        Login
      </Link>

      <Link
        to="/register"
        onClick={mobile ? onCloseMobileMenu : undefined}
        className={`group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b6e653] hover:shadow-lg hover:shadow-primary/20 ${
          mobile ? "w-full rounded-xl" : ""
        }`}
      >
        Get Started
        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("wheypro-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  // Apply and persist the selected theme.
  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("wheypro-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeMobileMenu();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl"
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2.5"
            aria-label="WheyPro home"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary transition-transform duration-300 group-hover:rotate-12">
              <Zap className="size-5 fill-current text-primary-foreground" />
            </span>

            <span className="text-xl font-black tracking-tight text-foreground">
              WHEY<span className="text-[#91B83F]">PRO</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle
              theme={theme}
              onToggle={toggleTheme}
            />

            <AuthActions
              status={status}
              user={user}
              onLogout={handleLogout}
              onCloseMobileMenu={closeMobileMenu}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-xl border border-border transition-colors hover:bg-secondary md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 right-0 top-20 z-50 border-b border-border bg-background p-6 shadow-xl md:hidden"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Appearance
                  </span>

                  <ThemeToggle
                    mobile
                    theme={theme}
                    onToggle={toggleTheme}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <AuthActions
                    mobile
                    status={status}
                    user={user}
                    onLogout={handleLogout}
                    onCloseMobileMenu={closeMobileMenu}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
