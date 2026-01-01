import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { useSession } from "next-auth/react";

interface userData {
  id: string;
  name: string;
  role: string;
  image: string;
  banner?: string;
  createdAt?: Date;
}

export default function UserButton({
  data,
  className,
}: {
  data: userData;
  className?: string;
}) {
  const { data: session } = useSession();

  const route = session
    ? session.user.id == data.id
      ? "/user/me"
      : `/user/${data.id}`
    : `/user/${data.id}`;

  return (
    <Button
      className={`${cn(className)} relative bg-accent hover:bg-muted h-13`}
      onClick={() => (window.location.href = route)}
    >
      <div className="relative rounded-full overflow-hidden w-10 h-10 mr-auto">
        <Image
          src={data.image}
          alt={`avatar-${data.id}`}
          className="rounded-full object-cover"
          fill
        />
      </div>
      <Label className="font-bold text-xl absolute left-16">{data.name}</Label>
      <Badge className="font-bold absolute right-4 rounded-sm bg-foreground text-background">
        {data.role}
      </Badge>
    </Button>
  );
}
