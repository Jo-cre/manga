"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const width = useSidebar().open ? "calc(100% - 16rem)" : "100%";

  useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);
  return (
    <div
      className="absolute z-0 flex flex-col items-center justify-center w-screen h-full transition-all duration-300"
      style={{ width: width }}
    >
      <Card className="w-1/4 h-1/2">
        <CardHeader className="text-center text-2xl">
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-center contain-content">
          <Button
            variant="outline"
            size="icon-lg"
            onClick={() => handleSignIn({ type: "google" })}
          >
            <FcGoogle />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

type Provider = {
  type: "google" | "github" | "discord";
};

function handleSignIn(provider: Provider) {
  signIn(provider.type, { callbackUrl: "/" });
}
