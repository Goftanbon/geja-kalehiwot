import { getPublishedHomeSlides } from "@/app/data/user/home-slides";
import { getUpcomingHomeEvents } from "@/app/data/user/home-events";
import { getSession } from "@/lib/get-session";
import HomeClient from "./_components/HomeClient";

export default async function Home() {
  const [session, slides, events] = await Promise.all([
    getSession(),
    getPublishedHomeSlides().catch(() => null),
    getUpcomingHomeEvents().catch(() => null),
  ]);

  return (
    <HomeClient
      user={
        session
          ? {
              name: session.user.name,
              image: session.user.image,
              email: session.user.email,
            }
          : null
      }
      slides={slides}
      events={events}
    />
  );
}
