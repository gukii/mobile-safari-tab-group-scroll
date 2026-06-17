import { useState } from "react";
import { useMobileSafariTabGroupScroll } from "@gukii/mobile-safari-tab-group-scroll";
import "@gukii/mobile-safari-tab-group-scroll/styles.css";

export function SettingsToggleExample() {
  const [enabled, setEnabled] = useState(true);
  const tabGroup = useMobileSafariTabGroupScroll({ enabled });

  return (
    <main>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
        />
        Safari tab-group correction
      </label>

      {tabGroup.isLikelyTabGroupChromeVisible ? (
        <div role="status">
          Correcting by {tabGroup.scrollPx}px
        </div>
      ) : null}
    </main>
  );
}
