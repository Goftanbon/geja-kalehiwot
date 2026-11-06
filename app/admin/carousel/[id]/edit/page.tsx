import { notFound } from "next/navigation";

import { adminGetHomeSlide } from "@/app/data/admin/admin-get-home-slide";
import CarouselForm from "../../_components/CarouselForm";
// import CarouselForm from "@/app/admin/carousel/_components/carousel-form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCarouselPage({ params }: Props) {
  const { id } = await params;

  const slide = await adminGetHomeSlide(id);

  if (!slide) {
    notFound();
  }

  return <CarouselForm slide={slide} />;
}
