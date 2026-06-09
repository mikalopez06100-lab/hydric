import { BottomNav } from "@/components/layout/BottomNav";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="relative mx-auto min-h-screen max-w-phone bg-bone pb-20">
        {children}
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
