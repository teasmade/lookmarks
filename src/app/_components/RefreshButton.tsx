"use client";

import { useRouter } from "next/navigation";

export default function RefreshButton() {
  const router = useRouter();
  return (
    <span>
      <button
        onClick={() => {
          router.refresh();
        }}
        className="-mt-1 text-4xl font-bold text-blue-500 transition-colors duration-300 hover:text-blue-300"
      >
        ⟳
      </button>
    </span>
  );
}
