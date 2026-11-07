import { notFound } from "next/navigation";
import { getPublishedNewsBySlug } from "@/app/data/user/home-news";
import { getSession } from "@/lib/get-session";
import NewsDetailClient from "./NewsDetailClient";

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsPageProps) {
  const { slug } = await params;
  const news = await getPublishedNewsBySlug(slug);

  if (!news) {
    return {
      title: "News Not Found | Geja Kale Hiwot Church",
    };
  }

  const title = news.titleEn;
  const description = news.excerptEn || news.contentEn.slice(0, 160);

  return {
    title: `${title} | Geja Kale Hiwot Church`,
    description,
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const [session, news] = await Promise.all([
    getSession(),
    getPublishedNewsBySlug(slug),
  ]);

  if (!news) {
    notFound();
  }

  return (
    <NewsDetailClient
      news={news}
      user={
        session
          ? {
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
            }
          : null
      }
    />
  );
}

