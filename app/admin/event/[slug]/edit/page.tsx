import { notFound } from "next/navigation";

import { adminGetEventBySlug } from "@/app/data/admin/admin-get-event";
import EventForm from "../../_components/EventForm";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditEventPage({ params }: Props) {
  const { slug } = await params;

  const event = await adminGetEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventForm event={event} />;
}

