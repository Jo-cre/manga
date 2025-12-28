"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);

  return (
    <div className="z-0 flex flex-1 flex-col items-center justify-center h-full transition-all duration-300">
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

// only google is working by now
type Provider = {
  type: "google" | "github";
};

function handleSignIn(provider: Provider) {
  signIn(provider.type, { callbackUrl: "/" });
}
