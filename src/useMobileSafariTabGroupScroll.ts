import { useEffect, useRef, useState } from "react";

export type MobileSafariTabGroupScrollState = {
  isLikelyMobileSafari: boolean;
  isLikelyTabGroupChromeVisible: boolean;
  offsetPx: number;
  scrollPx: number;
};

export type MobileSafariTabGroupScrollOptions = {
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

const defaultStoragePrefix = "ios-safari-vv-baseline:";
const defaultTabGroupMinPx = 24;
const defaultTabGroupMaxPx = 80;
const defaultTabGroupOffsetPx = 34;
const defaultScrollCorrectionMultiplier = 3;
const defaultPortraitSafariViewportRatioWithoutTabGroup = 0.79;
const defaultLandscapeSafariViewportRatioWithoutTabGroup = 0.69;
const defaultOffsetCssVariable = "--mobile-safari-tab-group-offset";
const defaultScrollCssVariable = "--mobile-safari-tab-group-scroll";
const defaultDetectedClassName = "mobile-safari-tab-group-detected";
const defaultCorrectionDelaysMs = [120, 300, 500, 800, 1200];

export const defaultKnownAppleScreenSizes = new Set([
  "320x568",
  "375x667",
  "375x812",
  "390x844",
  "393x852",
  "402x874",
  "414x736",
  "414x896",
  "428x926",
  "430x932",
  "744x1133",
  "768x1024",
  "810x1080",
  "820x1180",
  "834x1112",
  "834x1194",
  "1024x1366",
]);

function hasWindow() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function isLikelyMobileSafari() {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent;
  const { vendor, platform } = navigator;
  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) || (platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari =
    /Safari/.test(userAgent) &&
    /Apple Computer/.test(vendor) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(userAgent);

  return isIOS && isSafari;
}

function getScreenPointKey() {
  const width = Math.min(window.screen.width, window.screen.height);
  const height = Math.max(window.screen.width, window.screen.height);
  return `${width}x${height}`;
}

function getBaselineKey(storagePrefix: string) {
  const orientation = window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape";
  return `${storagePrefix}${getScreenPointKey()}:${orientation}`;
}

function getViewportHeight() {
  return Math.round(window.visualViewport?.height ?? window.innerHeight);
}

function getExpectedSafariViewportHeight(options: RequiredResolvedOptions) {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const screenHeight = isPortrait
    ? Math.max(window.screen.width, window.screen.height)
    : Math.min(window.screen.width, window.screen.height);
  const ratio = isPortrait ? options.portraitRatio : options.landscapeRatio;

  return Math.round(screenHeight * ratio);
}

function isKeyboardLikelyOpen() {
  if (!window.visualViewport) return false;

  const lostHeight = window.innerHeight - window.visualViewport.height;
  const activeTag = document.activeElement?.tagName;
  const hasTextInputFocused =
    activeTag === "INPUT" ||
    activeTag === "TEXTAREA" ||
    document.activeElement?.getAttribute("contenteditable") === "true";

  return hasTextInputFocused && lostHeight > 120;
}

function readStoredBaseline(key: string) {
  try {
    const value = Number(window.localStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function writeStoredBaseline(key: string, height: number) {
  try {
    const current = readStoredBaseline(key);
    if (height > current) {
      window.localStorage.setItem(key, String(height));
    }
  } catch {
    // Private browsing and storage policies can make localStorage unavailable.
  }
}

type RequiredResolvedOptions = {
  storagePrefix: string;
  tabGroupMinPx: number;
  tabGroupMaxPx: number;
  defaultTabGroupOffsetPx: number;
  scrollCorrectionMultiplier: number;
  portraitRatio: number;
  landscapeRatio: number;
  knownAppleScreenSizes: Set<string>;
};

function resolveMeasureOptions(options: MobileSafariTabGroupScrollOptions): RequiredResolvedOptions {
  return {
    storagePrefix: options.storagePrefix ?? defaultStoragePrefix,
    tabGroupMinPx: options.tabGroupMinPx ?? defaultTabGroupMinPx,
    tabGroupMaxPx: options.tabGroupMaxPx ?? defaultTabGroupMaxPx,
    defaultTabGroupOffsetPx: options.defaultTabGroupOffsetPx ?? defaultTabGroupOffsetPx,
    scrollCorrectionMultiplier: options.scrollCorrectionMultiplier ?? defaultScrollCorrectionMultiplier,
    portraitRatio: options.expectedViewportRatios?.portrait ?? defaultPortraitSafariViewportRatioWithoutTabGroup,
    landscapeRatio: options.expectedViewportRatios?.landscape ?? defaultLandscapeSafariViewportRatioWithoutTabGroup,
    knownAppleScreenSizes: new Set(options.knownAppleScreenSizes ?? defaultKnownAppleScreenSizes),
  };
}

function emptyState(isSafari = false): MobileSafariTabGroupScrollState {
  return {
    isLikelyMobileSafari: isSafari,
    isLikelyTabGroupChromeVisible: false,
    offsetPx: 0,
    scrollPx: 0,
  };
}

function measure(options: RequiredResolvedOptions): MobileSafariTabGroupScrollState {
  const isSafari = isLikelyMobileSafari();

  if (
    !isSafari ||
    !window.visualViewport ||
    !options.knownAppleScreenSizes.has(getScreenPointKey()) ||
    isKeyboardLikelyOpen()
  ) {
    return emptyState(isSafari);
  }

  const key = getBaselineKey(options.storagePrefix);
  const viewportHeight = getViewportHeight();
  const storedBaseline = readStoredBaseline(key);

  writeStoredBaseline(key, viewportHeight);

  const baseline = Math.max(storedBaseline, viewportHeight);
  const baselineDelta = baseline - viewportHeight;
  const layoutViewportDelta = Math.round(window.innerHeight - (window.visualViewport?.height ?? window.innerHeight));
  const expectedViewportDelta = getExpectedSafariViewportHeight(options) - viewportHeight;
  const plausibleDeltas = [baselineDelta, layoutViewportDelta, expectedViewportDelta].filter(
    (delta) => delta >= options.tabGroupMinPx && delta <= options.tabGroupMaxPx,
  );
  const offsetPx = Math.max(0, ...plausibleDeltas);
  const looksLikeTabGroupLine = offsetPx > 0;
  const finalOffsetPx = looksLikeTabGroupLine ? Math.round(offsetPx || options.defaultTabGroupOffsetPx) : 0;

  return {
    isLikelyMobileSafari: true,
    isLikelyTabGroupChromeVisible: looksLikeTabGroupLine,
    offsetPx: finalOffsetPx,
    scrollPx: Math.round(finalOffsetPx * options.scrollCorrectionMultiplier),
  };
}

export function useMobileSafariTabGroupScroll({
  enabled = true,
  applyScrollCorrection = true,
  logDetection = true,
  offsetCssVariable = defaultOffsetCssVariable,
  scrollCssVariable = defaultScrollCssVariable,
  detectedClassName = defaultDetectedClassName,
  correctionDelaysMs = defaultCorrectionDelaysMs,
  ...measureOptions
}: MobileSafariTabGroupScrollOptions = {}): MobileSafariTabGroupScrollState {
  const loggedDetectionRef = useRef(false);
  const scheduledScrollRef = useRef(0);
  const [state, setState] = useState<MobileSafariTabGroupScrollState>(() => emptyState());

  useEffect(() => {
    if (!hasWindow()) return;

    let frame = 0;
    const timeouts: number[] = [];
    const resolvedOptions = resolveMeasureOptions(measureOptions);

    const clearCorrection = () => {
      document.documentElement.style.removeProperty(offsetCssVariable);
      document.documentElement.style.removeProperty(scrollCssVariable);
      document.documentElement.classList.remove(detectedClassName);
      scheduledScrollRef.current = 0;
    };

    if (!enabled) {
      clearCorrection();
      setState(emptyState(isLikelyMobileSafari()));
      return clearCorrection;
    }

    const scrollToOffset = (scrollPx: number) => {
      if (!applyScrollCorrection || scrollPx <= 0 || isKeyboardLikelyOpen()) return;

      const scrollingElement = document.scrollingElement ?? document.documentElement;
      scrollingElement.scrollTop = scrollPx;
      window.scrollTo({ top: scrollPx, left: 0, behavior: "instant" });
    };

    const scheduleScrollCorrection = (scrollPx: number) => {
      if (!applyScrollCorrection || scrollPx <= 0) return;

      scheduledScrollRef.current = scrollPx;

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => scrollToOffset(scrollPx));
      });

      correctionDelaysMs.forEach((delay) => {
        timeouts.push(window.setTimeout(() => scrollToOffset(scrollPx), delay));
      });
    };

    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const next = measure(resolvedOptions);
        setState(next);
        document.documentElement.style.setProperty(offsetCssVariable, `${next.offsetPx}px`);
        document.documentElement.style.setProperty(scrollCssVariable, `${next.scrollPx}px`);
        document.documentElement.classList.toggle(detectedClassName, next.offsetPx > 0);

        if (next.isLikelyTabGroupChromeVisible && logDetection && !loggedDetectionRef.current) {
          loggedDetectionRef.current = true;
          console.info(
            `Detected mobile Safari tab-group viewport offset: ${next.offsetPx}px`,
            {
              innerHeight: window.innerHeight,
              visualViewportHeight: window.visualViewport?.height,
              scrollCorrection: next.scrollPx,
              scrollHeight: document.scrollingElement?.scrollHeight,
            },
          );
        }

        if (next.scrollPx > 0 && scheduledScrollRef.current !== next.scrollPx) {
          scheduleScrollCorrection(next.scrollPx);
        } else if (next.offsetPx === 0) {
          scheduledScrollRef.current = 0;
        }
      });
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);

    return () => {
      window.cancelAnimationFrame(frame);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
      clearCorrection();
    };
  }, [
    enabled,
    applyScrollCorrection,
    logDetection,
    measureOptions.storagePrefix,
    measureOptions.tabGroupMinPx,
    measureOptions.tabGroupMaxPx,
    measureOptions.defaultTabGroupOffsetPx,
    measureOptions.scrollCorrectionMultiplier,
    measureOptions.expectedViewportRatios?.portrait,
    measureOptions.expectedViewportRatios?.landscape,
    measureOptions.knownAppleScreenSizes,
    offsetCssVariable,
    scrollCssVariable,
    detectedClassName,
    correctionDelaysMs,
  ]);

  return state;
}

export const useMobileSafariTabGroupOffset = useMobileSafariTabGroupScroll;
