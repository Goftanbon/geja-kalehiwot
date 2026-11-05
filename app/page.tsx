import { getSession } from "@/lib/get-session";
import HomeClient from "./_components/HomeClient";

export default async function Home() {
  const session = await getSession();

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
    />
  );
}
