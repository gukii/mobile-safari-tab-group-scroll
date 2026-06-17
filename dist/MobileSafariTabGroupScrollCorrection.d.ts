import { type ReactNode } from "react";
import { type MobileSafariTabGroupScrollOptions, type MobileSafariTabGroupScrollState } from "./useMobileSafariTabGroupScroll";
export type MobileSafariTabGroupScrollCorrectionProps = MobileSafariTabGroupScrollOptions & {
    children?: (state: MobileSafariTabGroupScrollState) => ReactNode;
    fallback?: ReactNode;
};
export declare function MobileSafariTabGroupScrollCorrection({ fallback, children, ...options }: MobileSafariTabGroupScrollCorrectionProps): import("react").JSX.Element;
//# sourceMappingURL=MobileSafariTabGroupScrollCorrection.d.ts.map