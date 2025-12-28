"use client";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({
  size = 50,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <ArrowLeft className={cn(className)} size={size} onClick={handleGoBack} />
  );
}
