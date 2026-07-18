"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Redirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return (
    <div className="content-shell py-24 text-sm text-muted">
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <p>
        This page moved.{" "}
        <a href={to} className="text-accent hover:underline">
          Continue
        </a>
      </p>
    </div>
  );
}
