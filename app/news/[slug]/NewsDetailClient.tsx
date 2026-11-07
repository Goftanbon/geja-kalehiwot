"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ChevronRight, User } from "lucide-react";
import { PublicNavbar } from "@/app/_components/PublicNavbar";
import { T, type Lang } from "@/lib/translations";
import { useContructUrl } from "@/hooks/use-construct-url";
import type { PublishedHomeNewsItem } from "@/app/data/user/home-news";

type NewsDetailClientProps = {
  news: PublishedHomeNewsItem;
  user: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
};

function formatNewsDate(date: Date | string, lang: Lang): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  if (lang === "am") {
    return d.toLocaleDateString("am-ET", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export default function NewsDetailClient({
  news,
  user,
}: NewsDetailClientProps) {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "am" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const switchLang = () => {
    const next: Lang = lang === "en" ? "am" : "en";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const title = lang === "am" && news.titleAm ? news.titleAm : news.titleEn;
  const excerpt =
    lang === "am" && news.excerptAm ? news.excerptAm : news.excerptEn;
  const content =
    lang === "am" && news.contentAm ? news.contentAm : news.contentEn;

  const formattedDate = formatNewsDate(news.publishedAt || news.createdAt, lang);
  const imageUrl = news.image ? useContructUrl(news.image) : null;

  return (
    <div lang={lang} className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicNavbar user={user} lang={lang} onSwitchLang={switchLang} />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/#news"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>{t.ui.backToNews}</span>
          </Link>
        </div>

        {/* Article Header */}
        <article>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {news.category.replace(/_/g, " ")}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <CalendarDays className="size-3.5 text-blue-500" />
              <span>{formattedDate}</span>
            </span>
            {news.author && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="size-3.5" />
                <span>{news.author}</span>
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight text-foreground">
            {title}
          </h1>

          {excerpt && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {excerpt}
            </p>
          )}

          {/* Conditional Image: ONLY rendered if image exists in DB, no fallback or placeholder */}
          {imageUrl && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted">
              <img
                src={imageUrl}
                alt={title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-foreground/90 sm:text-lg sm:leading-8">
            {content}
          </div>

          {/* Navigation Footer */}
          <div className="mt-14 flex items-center justify-between border-t border-border pt-6">
            <Link
              href="/#news"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="size-4" />
              <span>{t.ui.backToNews}</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{t.ui.home}</span>
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </article>
      </main>

      <footer className="mt-auto border-t border-border py-8 text-center text-xs text-muted-foreground">
        {t.ui.footer(new Date().getFullYear())}
      </footer>
    </div>
  );
}

