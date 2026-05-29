import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  userId: string;
  name: string;
  image?: string | null;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg";
  linkToProfile?: boolean;
}

const sizeClasses = {
  sm: "w-10 h-10 text-sm border-2",
  md: "w-12 h-12 text-lg border-2",
  lg: "w-16 h-16 text-xl border-4",
};

const dotClasses = {
  sm: "w-2.5 h-2.5 border",
  md: "w-3 h-3 border-2",
  lg: "w-3.5 h-3.5 border-2",
};

export function UserAvatar({
  userId,
  name,
  image,
  isOnline = false,
  size = "md",
  linkToProfile = true,
}: UserAvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const avatar = (
    <div className="relative shrink-0">
      {image ? (
        <div
          className={cn(
            "relative rounded-full overflow-hidden border-primary-container",
            sizeClasses[size]
          )}
        >
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
      ) : (
        <div
          className={cn(
            "rounded-full bg-primary-container/20 flex items-center justify-center font-bold text-primary border-primary-container",
            sizeClasses[size]
          )}
        >
          {initial}
        </div>
      )}
      {isOnline && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full bg-primary border-surface-container-lowest",
            dotClasses[size]
          )}
          aria-label="Online"
        />
      )}
    </div>
  );

  if (!linkToProfile) return avatar;

  return (
    <Link href={`/perfil/${userId}`} className="shrink-0">
      {avatar}
    </Link>
  );
}
