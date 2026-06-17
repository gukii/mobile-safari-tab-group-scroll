# @gukii/mobile-safari-tab-group-scroll

React hook for detecting the extra iOS Safari tab-group row and applying a delayed scroll correction.

This is intended for full-screen mobile web apps where iPhone/iPad Safari tab groups can reduce the usable viewport while the app still lays out like the full viewport is available.

## Install

From npm after publishing:

```bash
pnpm add @gukii/mobile-safari-tab-group-scroll
```

From a public GitHub repo before publishing:

```bash
pnpm add github:gukii/mobile-safari-tab-group-scroll
```

The package commits `dist/`, so installing from GitHub does not need build-script allowlisting.

From a local checkout:

```bash
pnpm add /absolute/path/to/mobile-safari-tab-group-scroll
```

In a pnpm workspace:

```json
{
  "dependencies": {
    "@gukii/mobile-safari-tab-group-scroll": "workspace:*"
  }
}
```

Install it in another app from GitHub:

```bash
pnpm add github:gukii/mobile-safari-tab-group-scroll
```

Publishing to npm later is optional:

```bash
pnpm publish --access public
```

## Basic Usage

Import the hook once near the root of your React app.

```tsx
import { useMobileSafariTabGroupScroll } from "@gukii/mobile-safari-tab-group-scroll";
import "@gukii/mobile-safari-tab-group-scroll/styles.css";

export function App() {
  const safariTabGroup = useMobileSafariTabGroupScroll();

  return (
    <main>
      {safariTabGroup.isLikelyTabGroupChromeVisible ? (
        <div>
          Safari tab group detected: {safariTabGroup.offsetPx}px
        </div>
      ) : null}
      <YourApp />
    </main>
  );
}
```

## With A Settings Toggle

```tsx
import { useState } from "react";
import { useMobileSafariTabGroupScroll } from "@gukii/mobile-safari-tab-group-scroll";
import "@gukii/mobile-safari-tab-group-scroll/styles.css";

export function App() {
  const [enabled, setEnabled] = useState(true);
  const safariTabGroup = useMobileSafariTabGroupScroll({ enabled });

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
        />
        Safari tab-group correction
      </label>

      {safariTabGroup.isLikelyTabGroupChromeVisible ? (
        <div>Correcting by {safariTabGroup.scrollPx}px</div>
      ) : null}
    </>
  );
}
```

## SSR / Client-Only Wrapper

For SSR frameworks, use `MobileSafariTabGroupScrollCorrection`. It is a client component and waits until after client mount before calling the hook.

```tsx
import { MobileSafariTabGroupScrollCorrection } from "@gukii/mobile-safari-tab-group-scroll";
import "@gukii/mobile-safari-tab-group-scroll/styles.css";

export function SafariViewportCorrection() {
  return (
    <MobileSafariTabGroupScrollCorrection>
      {(state) =>
        state.isLikelyTabGroupChromeVisible ? (
          <div role="status">
            Safari tab group corrected by {state.scrollPx}px
          </div>
        ) : null
      }
    </MobileSafariTabGroupScrollCorrection>
  );
}
```

Render it once near the root of your app. If you do not need UI, omit `children`:

```tsx
<MobileSafariTabGroupScrollCorrection />
```

### Next.js App Router

Create a client component:

```tsx
// app/SafariViewportCorrection.tsx
"use client";

import { MobileSafariTabGroupScrollCorrection } from "@gukii/mobile-safari-tab-group-scroll";

export function SafariViewportCorrection() {
  return <MobileSafariTabGroupScrollCorrection />;
}
```

Import the CSS and render the client component from your root layout:

```tsx
// app/layout.tsx
import "@gukii/mobile-safari-tab-group-scroll/styles.css";
import { SafariViewportCorrection } from "./SafariViewportCorrection";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SafariViewportCorrection />
        {children}
      </body>
    </html>
  );
}
```

### TanStack Start

Render the correction component in your root route/component:

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MobileSafariTabGroupScrollCorrection } from "@gukii/mobile-safari-tab-group-scroll";
import "@gukii/mobile-safari-tab-group-scroll/styles.css";

export const Route = createFileRoute("/__root")({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <MobileSafariTabGroupScrollCorrection />
      <Outlet />
    </>
  );
}
```

## CSS Integration

The package CSS defines:

```css
:root {
  --mobile-safari-tab-group-offset: 0px;
  --@gukii/mobile-safari-tab-group-scroll: var(--mobile-safari-tab-group-offset);
}
```

When a tab group is detected, the hook adds this class to `<html>`:

```css
mobile-safari-tab-group-detected
```

The included CSS gives the page enough scrollable height for the correction:

```tsx
import "@gukii/mobile-safari-tab-group-scroll/styles.css";
```

If your app has stronger mobile layout rules such as `overflow: hidden` on `html`, `body`, or `#root`, import this CSS after your app CSS or copy the rule into your app stylesheet.

## Options

```ts
type MobileSafariTabGroupScrollOptions = {
  enabled?: boolean;
  applyScrollCorrection?: boolean;
  logDetection?: boolean;
  storagePrefix?: string;
  tabGroupMinPx?: number;
  tabGroupMaxPx?: number;
  defaultTabGroupOffsetPx?: number;
  scrollCorrectionMultiplier?: number;
  expectedViewportRatios?: {
    portrait?: number;
    landscape?: number;
  };
  knownAppleScreenSizes?: Iterable<string>;
  offsetCssVariable?: string;
  scrollCssVariable?: string;
  detectedClassName?: string;
  correctionDelaysMs?: number[];
};
```

Defaults match the behavior developed for this app:

```ts
useMobileSafariTabGroupScroll({
  scrollCorrectionMultiplier: 3,
  correctionDelaysMs: [120, 300, 500, 800, 1200],
});
```

`applyScrollCorrection` performs one controlled correction sequence per detected offset. It does not continuously force the scroll position. The `correctionDelaysMs` values are delayed retries inside that single sequence so Safari can finish its first layout pass before the final correction runs.

## Return Value

```ts
type MobileSafariTabGroupScrollState = {
  isLikelyMobileSafari: boolean;
  isLikelyTabGroupChromeVisible: boolean;
  offsetPx: number;
  scrollPx: number;
};
```

## Exports

```ts
import {
  MobileSafariTabGroupScrollCorrection,
  useMobileSafariTabGroupScroll,
  useMobileSafariTabGroupOffset,
} from "@gukii/mobile-safari-tab-group-scroll";
```

`useMobileSafariTabGroupOffset` is a compatibility alias for `useMobileSafariTabGroupScroll`.

## Notes

- This is a pragmatic heuristic, not an official Safari API.
- The hook combines several signals:
  - iOS Safari user-agent detection
  - known Apple screen point sizes
  - `visualViewport.height`
  - `innerHeight - visualViewport.height`
  - a stored best-seen viewport baseline by device and orientation
  - expected Safari viewport ratios
- It avoids applying corrections while the keyboard is likely open.
- If Safari changes its viewport reporting, tune `expectedViewportRatios`, `tabGroupMinPx`, `tabGroupMaxPx`, or `scrollCorrectionMultiplier`.
