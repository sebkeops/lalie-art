"use client";

import { Suspense } from "react";
import { HashScroll } from "./HashScroll";

export default function HashScrollSuspense() {
  return (
    <Suspense fallback={null}>
      <HashScroll />
    </Suspense>
  );
}