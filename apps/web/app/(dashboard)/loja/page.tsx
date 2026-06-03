import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { STORE_ITEMS } from "database";
import { authOptions } from "@/lib/auth";
import { getStoreStateForUser } from "@/lib/store";
import { StorePanel } from "@/components/store/store-panel";

export const dynamic = "force-dynamic";

export default async function LojaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const state = await getStoreStateForUser(session.user.id);
  if (!state) redirect("/login");

  return <StorePanel items={STORE_ITEMS} state={state} />;
}
