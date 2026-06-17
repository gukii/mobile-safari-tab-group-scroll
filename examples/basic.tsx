import { useMobileSafariTabGroupScroll } from "mobile-safari-tab-group-scroll";
import "mobile-safari-tab-group-scroll/styles.css";

export function BasicExample() {
  const tabGroup = useMobileSafariTabGroupScroll();

  return (
    <main>
      {tabGroup.isLikelyTabGroupChromeVisible ? (
        <div role="status">
          Safari tab group detected: {tabGroup.offsetPx}px
        </div>
      ) : null}
      <div>Your app content</div>
    </main>
  );
}
