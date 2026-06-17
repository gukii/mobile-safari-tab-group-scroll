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
export declare const defaultKnownAppleScreenSizes: Set<string>;
export declare function useMobileSafariTabGroupScroll({ enabled, applyScrollCorrection, logDetection, offsetCssVariable, scrollCssVariable, detectedClassName, correctionDelaysMs, ...measureOptions }?: MobileSafariTabGroupScrollOptions): MobileSafariTabGroupScrollState;
export declare const useMobileSafariTabGroupOffset: typeof useMobileSafariTabGroupScroll;
//# sourceMappingURL=useMobileSafariTabGroupScroll.d.ts.map