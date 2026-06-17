# npm Publish Notes

This package is intended to publish as:

```text
@gukii/mobile-safari-tab-group-scroll
```

## Publish Command

From this package directory:

```bash
cd /Users/christianstampf/code/ts/ui/mobile-safari-tab-group-scroll
pnpm install --frozen-lockfile
pnpm run build
npm pack --dry-run
npm publish --access public --auth-type=web
```

Use `--auth-type=web` when npm asks for passkey/browser authentication instead of a 6-digit OTP.

## Expected Install Command

Once npm registry metadata resolves correctly:

```bash
pnpm add @gukii/mobile-safari-tab-group-scroll
```

Then import:

```tsx
import { useMobileSafariTabGroupScroll } from "@gukii/mobile-safari-tab-group-scroll";
import "@gukii/mobile-safari-tab-group-scroll/styles.css";
```

## Current npm State Observed

Publishing `@gukii/mobile-safari-tab-group-scroll@0.1.0` appeared to succeed. A second publish attempt returned:

```text
You cannot publish over the previously published versions: 0.1.0.
```

That means npm has recorded version `0.1.0`.

However, immediately after publishing, npm package metadata still returned:

```bash
npm view @gukii/mobile-safari-tab-group-scroll version
```

with:

```text
404 Not Found
```

At the same time:

```bash
npm access get status @gukii/mobile-safari-tab-group-scroll
```

returned:

```text
@gukii/mobile-safari-tab-group-scroll: public
```

So npm was in an inconsistent state: access APIs saw the public package, while the public registry metadata endpoint still returned `404`.

## What To Do If This Happens

Wait and retry:

```bash
npm view @gukii/mobile-safari-tab-group-scroll version
pnpm add @gukii/mobile-safari-tab-group-scroll
```

Do not bump the version just to work around metadata propagation unless npm support confirms the package is stuck.

## Temporary Fallback

Until the npm registry metadata works, install from GitHub:

```bash
pnpm add github:gukii/mobile-safari-tab-group-scroll
```

The GitHub repo commits `dist/`, so pnpm can install it without build-script allowlisting.

## Useful Diagnostics

```bash
npm whoami
npm access get status @gukii/mobile-safari-tab-group-scroll
npm view @gukii/mobile-safari-tab-group-scroll version --json
curl -i https://registry.npmjs.org/@gukii%2fmobile-safari-tab-group-scroll
```

## Notes

- Use `pnpm` for installing dependencies locally.
- Use `npm publish` for publishing to the npm registry.
- Scoped public packages require:

```bash
npm publish --access public
```

- If npm asks for passkey/browser authentication, use:

```bash
npm publish --access public --auth-type=web
```
