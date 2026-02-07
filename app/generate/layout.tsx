import { requireAuth } from "@/lib/auth/redirectByAuth";
import { Sidebar } from "./_components/Sidebar";

export default async function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return (
    <div>
      <Sidebar />
      <div className="ml-65">{children}</div>
    </div>
  );
}
