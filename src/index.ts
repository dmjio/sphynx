// dmj: This code serves as an example of interthread communication
// Each interpreter runs in a rAF loop, sending
initBackground();

// dmj: executed by MTS
globalThis['renderPage'] = function () {
  const context = lynx.getJSContext();
  context.addEventListener("message", (event) => {
    console.log('got event in js context', event);
  });
  lynx.requestAnimationFrame(stepMain);
}

// dmj: executed by BTS only ( can access lynx.getJSModule('GlobalEventEmitter') here )
function initBackground () {
  'background only'
  const context = lynx.getCoreContext();
  context.addEventListener("message", (event) => {
    console.log('got event in core context', event);
  });
  lynx.requestAnimationFrame(stepBG);
}

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

globalThis['processData'] = function () {};
globalThis['runWorklet'] = (worklet, params) => {
  return worklet(params);
}
