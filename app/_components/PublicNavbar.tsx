"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { LogOut, Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { T, type Lang } from "@/lib/translations";

const NAV_HREFS = ["/#events", "/#news", "/#departments", "/#shop", "/#donate"];

type PublicNavbarProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
  lang: Lang;
  onSwitchLang: () => void;
};

export function PublicNavbar({ user, lang, onSwitchLang }: PublicNavbarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const t = T[lang];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success(t.ui.signedOut);
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || t.ui.logoutFailed);
          },
        },
      });
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = t.nav.map((label, i) => ({ label, href: NAV_HREFS[i] }));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1700px] items-center gap-3 px-3 sm:h-20 sm:gap-4 sm:px-8">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={t.ui.openMenu}
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>{t.ui.menu}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {[{ label: t.ui.home, href: "/" }, ...navLinks].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-brand-foreground">
            <img
              src="/logo.jpg"
              alt={t.brand}
              className="size-full object-cover"
            />
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block text-lg font-semibold tracking-tight">
              {t.brand}
            </span>
            <span className="mt-0.5 block text-[9px] tracking-[0.4em] text-muted-foreground">
              {t.brandSub}
            </span>
          </span>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <nav className="hidden items-center lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSwitchLang}
            aria-label={t.ui.switchLang}
            className="font-semibold"
          >
            {t.ui.langButton}
          </Button>

          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    aria-label={t.ui.account}
                    className="ml-1 flex size-8 items-center justify-center overflow-hidden rounded-full bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                }
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={`${user.name}'s profile`}
                    referrerPolicy="no-referrer"
                    className="size-8 object-cover"
                  />
                ) : (
                  <UserRound className="size-4" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold">
                      {user.name || t.ui.there}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  <LogOut className="mr-2 size-4" />
                  {loggingOut ? t.ui.loggingOut : t.ui.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants(), "ml-1 rounded-full px-5")}
            >
              {t.ui.login}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

