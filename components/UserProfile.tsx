"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, PenBox, Save, Loader2 } from "lucide-react";
import BackButton from "@/components/BackButton";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { userModel } from "@/lib/user/types";

interface Props {
  user: userModel;
  isOwner: boolean;
  locale: string;
}

interface UpdateUserPayload {
  name?: string;
  image?: string;
  banner?: string;
}

export default function UserProfile({ user, isOwner, locale }: Props) {
  const { data: session, update } = useSession();
  const t = useTranslations("UserPage");

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState<string | null>(user.image);
  const [banner, setBanner] = useState<string | null>(user.banner);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const hasChanges =
    isOwner &&
    (name !== user.name || avatarFile !== null || bannerFile !== null);

  async function uploadImage(file: File, type: "avatar" | "banner") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.url as string;
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload: UpdateUserPayload = {};

      if (name !== user.name) payload.name = name;

      if (avatarFile) {
        payload.image = await uploadImage(avatarFile, "avatar");
      }

      if (bannerFile) {
        payload.banner = await uploadImage(bannerFile, "banner");
      }

      if (Object.keys(payload).length === 0) return;

      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const updatedUser = await res.json();

      await update({
        user: {
          ...session?.user,
          name: updatedUser.name,
          image: updatedUser.image,
          banner: updatedUser.banner,
        },
      });

      setAvatarFile(null);
      setBannerFile(null);

      toast(t("toast.sucess"));
    } catch (e) {
      console.error(e);
      toast(t("toast.error"));
    }
    setSaving(false);
  }

  return (
    <div className="flex flex-1 justify-center px-10 py-20">
      <Card className="relative w-full max-w-5xl overflow-hidden py-0">
        <BackButton className="absolute top-0 left-0 z-9 rounded-br-lg bg-muted/50" />

        {/* Banner */}
        <div
          className={`relative h-56 w-full bg-muted ${
            isOwner && "cursor-pointer group"
          }`}
          onClick={() => isOwner && bannerRef.current?.click()}
        >
          {banner ? (
            <Image
              src={banner}
              alt="Banner"
              fill
              className="object-cover [image-rendering:pixelated]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              {t("noBanner")}
            </div>
          )}

          {isOwner && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
              <PenBox className="text-white" />
            </div>
          )}

          <input
            ref={bannerRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBannerFile(file);
              setBanner(URL.createObjectURL(file));
            }}
          />
        </div>

        {/* Avatar */}
        <div className="absolute right-10 top-48">
          <div
            className={`relative w-40 h-40 rounded-full border-2 overflow-hidden ${
              isOwner && "cursor-pointer group"
            }`}
            onClick={() => isOwner && avatarRef.current?.click()}
          >
            {avatar ? (
              <Image src={avatar} alt="Avatar" fill className="object-cover" />
            ) : (
              <User className="w-full h-full p-8 text-muted-foreground" />
            )}

            {isOwner && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                <PenBox className="text-white" />
              </div>
            )}
          </div>

          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setAvatarFile(file);
              setAvatar(URL.createObjectURL(file));
            }}
          />
        </div>

        {/* Content */}
        <div className="px-10 pb-10 pt-24 flex flex-col gap-6">
          <div>
            <Label>{t("name")}</Label>
            {isOwner ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-4xl font-bold bg-transparent border-b outline-none"
              />
            ) : (
              <p className="text-4xl font-bold">{user.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm max-w-2xl">
            <Info label={t("email")} value={user.email} />
            <Info label={t("role")} value={user.role.toUpperCase()} />
            <Info
              label={t("createdAt")}
              value={new Date(user.createdAt).toLocaleDateString(locale)}
            />
            <Info label={t("id")} value={user.id} mono />
          </div>
        </div>

        {isOwner && (
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="absolute bottom-6 right-6 gap-2"
          >
            <Save size={18} />
            {saving ? <Loader2 className="animate-spin" /> : t("saveButton")}
          </Button>
        )}
      </Card>
    </div>
  );
}

function Info({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <p className={`${mono && "font-mono"} text-muted-foreground break-all`}>
        {value}
      </p>
    </div>
  );
}
