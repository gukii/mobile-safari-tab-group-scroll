import { createFileRoute } from "@tanstack/react-router";
import { MobileSafariTabGroupScrollCorrection } from "@gukii/mobile-safari-tab-group-scroll";
import "@gukii/mobile-safari-tab-group-scroll/styles.css";

export const Route = createFileRoute("/__root")({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <MobileSafariTabGroupScrollCorrection>
        {(state) =>
          state.isLikelyTabGroupChromeVisible ? (
            <div role="status">
              Safari tab group corrected by {state.scrollPx}px
            </div>
          ) : null
        }
      </MobileSafariTabGroupScrollCorrection>
      {/* <Outlet /> goes here in your real root route. */}
    </>
  );
}

// TanStack Start usage:
// 1. Import "@gukii/mobile-safari-tab-group-scroll/styles.css" from your root client entry
//    or your root route/module.
// 2. Render <MobileSafariTabGroupScrollCorrection /> inside your root component.
// 3. The component waits until client mount before calling the hook, so SSR output
//    stays stable.
