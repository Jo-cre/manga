import BackButton from "@/components/BackButton";
import Topbar from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface dataModel {
  id: number;
  name: string;
  email: string;
  image: string;
  banner: string;
  role: string;
  createdAt: Date;
}

async function getData(id: string): Promise<dataModel | null> {
  const baseUrl = process.env.API_URL;
  const response = await fetch(`${baseUrl}/api/user?id=${id}`);

  if (!response.ok) {
    new Error(`Failed: ${response.status}`);
    return null;
  }
  return response.json();
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations("UserPage");

  const data: dataModel | null = await getData(id);

  if (!data) {
    return (
      <div className="flex flex-1 flex-col items-center content-center text-6xl h-full">
        404 User not found.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar />
      <div className="flex flex-1 justify-center px-10 py-20">
        <Card className="relative w-full max-w-5xl overflow-hidden py-0">
          <BackButton className="absolute top-0 left-0 z-2 rounded-br-lg bg-muted/50" />

          {/* Banner */}
          <div className="relative h-56 w-full bg-muted group cursor-pointer">
            {data.banner ? (
              <Image
                src={data.banner}
                alt="Banner"
                fill
                className="object-cover [image-rendering:pixelated]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                {t("noBanner")}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="absolute right-10 top-50 group cursor-pointer">
            <div className="relative w-40 h-40 rounded-full border-2 overflow-hidden">
              {data.image ? (
                <Image
                  src={data.image}
                  alt="Avatar"
                  fill
                  className="object-cover [image-rendering:pixelated]"
                />
              ) : (
                <User className="w-full h-full p-8 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-10 pb-10 pt-24 flex flex-col gap-6">
            {/* Name */}
            <div>
              <Label>{t("name")}</Label>
              <Label className="text-4xl font-bold bg-transparent outline-none border-b w-full">
                {data.name}
              </Label>
            </div>

            {/* Read only */}
            <div className="grid grid-cols-2 gap-6 text-sm max-w-2xl">
              <div>
                <Label>{t("email")}</Label>
                <p className="text-muted-foreground">{data.email}</p>
              </div>

              <div>
                <Label>{t("role")}</Label>
                <p className="uppercase text-muted-foreground">{data.role}</p>
              </div>

              <div>
                <Label>{t("createdAt")}</Label>
                <p className="text-muted-foreground">
                  {new Date(data.createdAt).toLocaleDateString(locale)}
                </p>
              </div>

              <div>
                <Label>{t("id")}</Label>
                <p className="font-mono text-xs text-muted-foreground break-all">
                  {data.id}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
