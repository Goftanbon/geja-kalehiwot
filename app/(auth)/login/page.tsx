import { Suspense } from "react";
import { redirect } from "next/navigation";
// import { getSession } from "@/lib/get-session";
import { LoginForm } from "./_components/LoginForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

async function LoginContent() {
  //   const session = await getSession();

  //   if (session) {
  //     redirect("/");
  //   }

  return <LoginForm />;
}

function LoginSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        {/* <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-48" /> */}
      </CardHeader>
      <CardContent>
        {/* <Skeleton className="h-10 w-full rounded-md" /> */}
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}
