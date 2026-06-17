"use client";

import { MobileSafariTabGroupScrollCorrection } from "@gukii/mobile-safari-tab-group-scroll";
import "@gukii/mobile-safari-tab-group-scroll/styles.css";

export function SafariTabGroupCorrection() {
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

// Next.js App Router usage:
//
// app/providers.tsx
// "use client";
// import { SafariTabGroupCorrection } from "@/components/SafariTabGroupCorrection";
//
// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <SafariTabGroupCorrection />
//       {children}
//     </>
//   );
// }
//
// app/layout.tsx
// import { Providers } from "./providers";
// import "@gukii/mobile-safari-tab-group-scroll/styles.css";
//
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }
