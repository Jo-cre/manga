"use client";

import { useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, PenBox, Save } from "lucide-react";
import Topbar from "@/components/Topbar";
import { toast } from "sonner";
import BackButton from "@/components/BackButton";
import { Session } from "next-auth";

interface UpdateUserPayload {
  name?: string;
  image?: string;
  banner?: string;
}

// Subcomponent cause i cant use useEffect
function ProfileEditor({
  session,
  update,
}: {
  session: Session;
  update: (
    data?: Partial<Session> | Record<string, unknown>
  ) => Promise<Session | null>;
}) {
  const [name, setName] = useState(session.user.name ?? "");
  const [avatar, setAvatar] = useState<string | null>(
    session.user.image ?? null
  );
  const [banner, setBanner] = useState<string | null>(
    session.user.banner ?? null
  );

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const original = useMemo(
    () => ({
      name: session?.user.name ?? "",
      avatar: session?.user.image ?? null,
      banner: session?.user.banner ?? null,
    }),
    [session]
  );

  const hasChanges =
    name !== original.name || avatarFile !== null || bannerFile !== null;

  async function uploadImage(file: File, type: "avatar" | "banner") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url as string;
  }

  async function handleSave() {
    if (!hasChanges) return;
    try {
      const payload: UpdateUserPayload = {};
      if (name !== original.name) payload.name = name;
      if (avatarFile) payload.image = await uploadImage(avatarFile, "avatar");
      if (bannerFile) payload.banner = await uploadImage(bannerFile, "banner");

      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast("Failed to update profile");
        return;
      }
      const updatedUser = await res.json();

      await update({
        ...session,
        user: {
          ...session.user,
          name: updatedUser.name,
          image: updatedUser.image,
          banner: updatedUser.banner,
        },
      });
      setAvatarFile(null);
      setBannerFile(null);
      toast("Profile has been Updated");
    } catch (e) {
      toast(`Error saving profile: ${e}`);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar />
      <div className="flex flex-1 justify-center px-10 py-20">
        <Card className="relative w-full max-w-5xl overflow-hidden py-0">
          <BackButton className="absolute top-0 left-0 z-2 rounded-br-lg bg-muted/50" />

          {/* Banner */}
          <div
            className="relative h-56 w-full bg-muted group cursor-pointer"
            onClick={() => bannerInputRef.current?.click()}
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
                No banner
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
              <PenBox className="text-white" />
            </div>
            <input
              ref={bannerInputRef}
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
          <div className="absolute right-10 top-50 group cursor-pointer">
            <div
              className="relative w-40 h-40 rounded-full border-2 overflow-hidden"
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt="Avatar"
                  fill
                  className="object-cover [image-rendering:pixelated]"
                />
              ) : (
                <User className="w-full h-full p-8 text-muted-foreground" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                <PenBox className="text-white" />
              </div>
            </div>
            <input
              ref={avatarInputRef}
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
              <Label>Name</Label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-4xl font-bold bg-transparent outline-none border-b w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm max-w-2xl">
              <div>
                <Label>Email</Label>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
              <div>
                <Label>Role</Label>
                <p className="uppercase text-muted-foreground">
                  {session.user.role}
                </p>
              </div>
              <div>
                <Label>Created at</Label>
                <p className="text-muted-foreground">
                  {new Date(session.user.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <Label>ID</Label>
                <p className="font-mono text-xs text-muted-foreground break-all">
                  {session.user.id}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="absolute bottom-6 right-6 gap-2"
          >
            <Save size={18} />
            Save
          </Button>
        </Card>
      </div>
    </div>
  );
}

// load manager
export default function LocalUserPage() {
  const { data: session, status, update } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">Loading...</div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center text-4xl">
        No session available
      </div>
    );
  }

  return (
    <ProfileEditor key={session.user.id} session={session} update={update} />
  );
}
