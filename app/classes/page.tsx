"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootClassesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/classes");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-sm">
      Redirecting to Class Allocation...
    </div>
  );
}