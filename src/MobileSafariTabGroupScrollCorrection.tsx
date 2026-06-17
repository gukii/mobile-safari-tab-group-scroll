"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  useMobileSafariTabGroupScroll,
  type MobileSafariTabGroupScrollOptions,
  type MobileSafariTabGroupScrollState,
} from "./useMobileSafariTabGroupScroll";

export type MobileSafariTabGroupScrollCorrectionProps = MobileSafariTabGroupScrollOptions & {
  children?: (state: MobileSafariTabGroupScrollState) => ReactNode;
  fallback?: ReactNode;
};

function MobileSafariTabGroupScrollCorrectionClient({
  children,
  ...options
}: Omit<MobileSafariTabGroupScrollCorrectionProps, "fallback">) {
  const state = useMobileSafariTabGroupScroll(options);
  return children ? <>{children(state)}</> : null;
}

export function MobileSafariTabGroupScrollCorrection({
  fallback = null,
  children,
  ...options
}: MobileSafariTabGroupScrollCorrectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{fallback}</>;

  return (
    <MobileSafariTabGroupScrollCorrectionClient {...options}>
      {children}
    </MobileSafariTabGroupScrollCorrectionClient>
  );
}
