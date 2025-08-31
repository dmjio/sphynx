sphynx 🐈
=======================

## About

This is a barebones [LynxJS](https://github.com/lynx-family/lynx) project meant to demonstrate cross-thread communication between background ([BTS](https://lynxjs.org/guide/scripting-runtime/index.html#background-thread)) and main threads ([MTS](https://lynxjs.org/react/main-thread-script.html)). This will help other compile-to-JS languages target [LynxJS](https://lynxjs.org). This also opens up the door for the consumption of [Native Modules](https://lynxjs.org/guide/use-native-modules#platform=ios) and interactign with native device APIs.

## Walkthrough

The background thread is able to communicate with the main thread via a context object.

```javascript
const context = lynx.getCoreContext();
```

Similarly, the main thread is able to communicate with the background thread via the same mechanism.

```javascript
const context = lynx.getJSContext();
```

Event listeners for the `"message"` event (shown below) are added to each thread. This allows each thread to relay messsages between each other via a call to `.postMessage(data)`.

### MTS setup

```javascript
// dmj: executed by MTS
globalThis['renderPage'] = function () {
  const context = lynx.getJSContext();
  context.addEventListener("message", (event) => {
    console.log('got event in js context', event);
  });
  lynx.requestAnimationFrame(stepMain);
}
 ```

### BTS setup

This function should be invoked top-level (e.g. `initBackground()`)

```javascript
function initBackground () {
  'background only'
  const context = lynx.getCoreContext();
  context.addEventListener("message", (event) => {
    console.log('got event in core context', event);
  });
  lynx.requestAnimationFrame(stepBG);
}
 ```

The communication occurs in each thread's event loop.

```javascript
function stepMain (frame) {
  const context = lynx.getJSContext();
  context.postMessage({ bg : frame });
  lynx.requestAnimationFrame(stepMain);
}

function stepBG (frame) {
  const context = lynx.getCoreContext();
  context.postMessage({ main : frame });
  lynx.requestAnimationFrame(stepBG);
}
```

## Lynx DevTool

The communication can be observed in the [LynxExplorer](https://lynxjs.org/guide/debugging/lynx-devtool.html).

<img width="461" height="422" alt="Screenshot 2025-08-30 at 10 06 08 AM" src="https://github.com/user-attachments/assets/f11f3e85-2ae5-4770-8947-50e44e02531f" />

## Plugin

The [ReactLynxPlugin](https://www.npmjs.com/package/@lynx-js/react-rsbuild-plugin) is used to facilitate [code splitting](https://lynxjs.org/react/code-splitting.html). This ensures code marked with `'background-only'` only executes on the background thread.

```typescript
 import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
```

See the [full source](src/index.ts).

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Scan the QRCode in the terminal with your `LynxExplorer` App to see the result.

You can start editing the page by modifying `src/App.tsx`. The page auto-updates as you edit the file.

## Name

The [sphynx cat](https://en.wikipedia.org/wiki/Sphynx_cat) has no hair.
