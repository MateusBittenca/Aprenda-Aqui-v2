import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HelpPanel } from "@/components/help/help-panel";

export const dynamic = "force-dynamic";

export default async function AjudaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return <HelpPanel />;
}
