import { notFound } from "next/navigation";

import { adminGetNewsBySlug } from "@/app/data/admin/admin-get-news-detail";
import NewsForm from "../../_components/NewsForm";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditNewsPage({ params }: Props) {
  const { slug } = await params;

  const news = await adminGetNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  return <NewsForm news={news} />;
}

