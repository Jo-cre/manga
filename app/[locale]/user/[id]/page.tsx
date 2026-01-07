import Topbar from "@/components/Topbar";
import UserProfile from "@/components/UserProfile";
import { getUser } from "@/lib/user/getUser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  const user = await getUser(id);
  if (!user) notFound();

  const session = await getServerSession(authOptions);
  const isOwner = session?.user.id === user.id;

  return (
    <div className="flex flex-1 flex-col">
      <Topbar />
      <UserProfile user={user} isOwner={isOwner} locale={locale} />
    </div>
  );
}
