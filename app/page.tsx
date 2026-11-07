import { getPublishedHomeSlides } from "@/app/data/user/home-slides";
import { getUpcomingHomeEvents } from "@/app/data/user/home-events";
import { getPublishedHomeNews } from "@/app/data/user/home-news";
import { getSession } from "@/lib/get-session";
import HomeClient from "./_components/HomeClient";

export default async function Home() {
  const [session, slides, events, news] = await Promise.all([
    getSession(),
    getPublishedHomeSlides().catch(() => null),
    getUpcomingHomeEvents().catch(() => null),
    getPublishedHomeNews().catch(() => null),
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
      news={news}
    />
  );
}
