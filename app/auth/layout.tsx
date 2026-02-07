import { requireNoAuth } from "@/lib/auth/redirectByAuth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireNoAuth();
  return <>{children}</>;
}
