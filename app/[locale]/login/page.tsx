"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaDiscord, FaGithubAlt, FaGoogle } from "react-icons/fa6";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);

  const methods = [
    {
      provider: "Google",
      icon: FaGoogle,
      action: () => handleSignIn("google"),
    },
    {
      provider: "Discord",
      icon: FaDiscord,
      action: () => handleSignIn("discord"),
    },
    {
      provider: "Github",
      icon: FaGithubAlt,
      action: () => handleSignIn("github"),
    },
  ];

  return (
    <div className="z-0 flex flex-1 flex-col items-center justify-center h-full transition-all duration-300">
      <Card className="min-w-1/4 w-auto h-auto">
        <CardHeader className="text-center text-2xl">
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center contain-content">
          {methods.map((m, i) => (
            <Button
              key={m.provider + i}
              variant="outline"
              className="flex flex-1 w-full text-xl h-10 my-1 items-center justify-start"
              onClick={m.action}
            >
              <m.icon className="size-6 mr-1" />
              {m.provider}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

type Provider = "google" | "github" | "discord";

function handleSignIn(provider: Provider) {
  signIn(provider, { callbackUrl: "/" });
}
