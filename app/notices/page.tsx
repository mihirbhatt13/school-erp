"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootNoticesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/notices");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-sm">
      Redirecting to Notice Board...
    </div>
  );
}
