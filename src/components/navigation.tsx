"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, BarChart2, Users, GitCompare } from "lucide-react";

const Navigation = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 px-4 md:px-8",
        scrolled ? "py-4 glass shadow-sm" : "py-6 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-display font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            ParlamentAR
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <NavLink href="/" exact icon={<Search className="h-4 w-4" />}>
            Busca
          </NavLink>
          <NavLink href="/ranking" icon={<BarChart2 className="h-4 w-4" />}>
            Ranking
          </NavLink>
          <NavLink href="/compare" icon={<GitCompare className="h-4 w-4" />}>
            Comparar
          </NavLink>
        </nav>

        <div className="flex md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

const NavLink = ({
  href,
  exact,
  icon,
  children,
}: {
  href: string;
  exact?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname?.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-accent"
        aria-label="Menu"
      >
        <div className="w-5 flex flex-col space-y-1.5">
          <span
            className={`block h-0.5 w-full bg-foreground transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-full bg-foreground transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-full bg-foreground transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-lg overflow-hidden animate-fadeIn">
          <div className="py-2 flex flex-col">
            <MobileNavLink href="/" icon={<Search className="h-4 w-4" />}>
              Busca
            </MobileNavLink>
            <MobileNavLink
              href="/ranking"
              icon={<BarChart2 className="h-4 w-4" />}
            >
              Ranking
            </MobileNavLink>
            <MobileNavLink
              href="/compare"
              icon={<GitCompare className="h-4 w-4" />}
            >
              Comparar
            </MobileNavLink>
          </div>
        </div>
      )}
    </div>
  );
};

const MobileNavLink = ({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-2 px-4 py-3 transition-all duration-200",
        isActive ? "bg-primary/10 text-primary" : "hover:bg-accent/50"
      )}
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  );
};

export default Navigation;
