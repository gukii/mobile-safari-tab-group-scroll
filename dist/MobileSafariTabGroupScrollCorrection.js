"use client";
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useMobileSafariTabGroupScroll, } from "./useMobileSafariTabGroupScroll";
function MobileSafariTabGroupScrollCorrectionClient({ children, ...options }) {
    const state = useMobileSafariTabGroupScroll(options);
    return children ? _jsx(_Fragment, { children: children(state) }) : null;
}
export function MobileSafariTabGroupScrollCorrection({ fallback = null, children, ...options }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted)
        return _jsx(_Fragment, { children: fallback });
    return (_jsx(MobileSafariTabGroupScrollCorrectionClient, { ...options, children: children }));
}
//# sourceMappingURL=MobileSafariTabGroupScrollCorrection.js.map