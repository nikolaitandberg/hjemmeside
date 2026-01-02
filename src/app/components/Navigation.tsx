"use client";

import { Github, Mail, Linkedin, Menu, X, Sun, Moon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

interface NavLink {
  href: string;
  icon: LucideIcon;
  label: string;
  ariaLabel: string;
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks: NavLink[] = [
    {
      href: "https://github.com/nikolaitandberg",
      icon: Github,
      label: "GitHub",
      ariaLabel: "Visit GitHub profile",
    },
    {
      href: "mailto:nikolai.tandbe@gmail.com",
      icon: Mail,
      label: "Email",
      ariaLabel: "Send email",
    },
    {
      href: "https://linkedin.com/in/nikolaitandberg",
      icon: Linkedin,
      label: "LinkedIn",
      ariaLabel: "Visit LinkedIn profile",
    },
  ];

  return (
    <div className="sticky top-0 z-50 w-full py-4">
      <nav
        className="mx-auto w-11/12 md:w-5/6 lg:w-4/6
                   h-12
                   px-4 sm:px-6 py-2
                   flex justify-between items-center gap-4 sm:gap-6
                   bg-background/80 backdrop-blur-md backdrop-saturate-150
                   border border-foreground/10
                   rounded-lg
                   shadow-sm
                   transition-all duration-300"
      >
        <span className="font-bold text-lg">Nikolai Tandberg</span>

        {/* Desktop navigation - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-4 sm:gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-label={link.ariaLabel}
                title={link.label}
                className="inline-flex items-center justify-center p-2 rounded-lg
                           transition-colors duration-300 hover:text-secondary
                           focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              >
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                <span className="sr-only">{link.label}</span>
              </a>
            );
          })}
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className="inline-flex items-center justify-center p-2 rounded-lg
                       transition-colors duration-300 hover:text-secondary
                       focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            {theme === "light" ? (
              <Moon className="h-6 w-6 sm:h-7 sm:w-7" />
            ) : (
              <Sun className="h-6 w-6 sm:h-7 sm:w-7" />
            )}
            <span className="sr-only">
              {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            </span>
          </button>
        </div>

        {/* Mobile hamburger menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          className="sm:hidden inline-flex items-center justify-center p-2 rounded-lg
                     transition-colors duration-300 hover:text-secondary
                     focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`sm:hidden mx-auto w-11/12 md:w-5/6 lg:w-4/6 mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="bg-background/80 backdrop-blur-md backdrop-saturate-150
                     border border-foreground/10
                     rounded-lg
                     shadow-sm
                     p-4
                     flex flex-col gap-2"
        >
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-label={link.ariaLabel}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                }}
                className={`flex items-center gap-3 p-3 rounded-lg
                           transition-all duration-300 hover:text-secondary hover:bg-foreground/5
                           focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
                           ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-base">{link.label}</span>
              </a>
            );
          })}
          {/* Theme toggle button in mobile menu */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              transitionDelay: isMenuOpen ? `${navLinks.length * 50}ms` : "0ms",
            }}
            className={`flex items-center gap-3 p-3 rounded-lg
                       transition-all duration-300 hover:text-secondary hover:bg-foreground/5
                       focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
                       ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
          >
            {theme === "light" ? (
              <>
                <Moon className="h-5 w-5" />
                <span className="text-base">Dark mode</span>
              </>
            ) : (
              <>
                <Sun className="h-5 w-5" />
                <span className="text-base">Light mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
