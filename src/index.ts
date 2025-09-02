import "lynxwebsockets";

// dmj: This code serves as an example of interthread communication
// Each interpreter runs in a rAF loop, sending messages back and forth
initBackground();

// dmj: executed by MTS
globalThis['renderPage'] = function () {
  const context = lynx.getJSContext();
  context.addEventListener("message", (event) => {
    console.log('got event in js context', event);
  });
  lynx.requestAnimationFrame(stepMain);
}

// dmj: Executed by BTS only ( can access lynx.getJSModule('GlobalEventEmitter') here )
function initBackground () {
  'background only'
  const context = lynx.getCoreContext();
  context.addEventListener("message", (event) => {
    console.log('got event in core context', event);
  });
  var ws = new WebSocket ('wss://echo.websocket.org');
  ws.onmessage = function (msg) {
    console.log('got message', msg);
  }
  stepBG(ws);
}

function stepMain (frame) {
  const context = lynx.getJSContext();
  context.postMessage({ bg : frame });
  lynx.requestAnimationFrame(stepMain);
}

function stepBG () {
  const context = lynx.getCoreContext();
  context.postMessage({ main : frame });
  setTimeout (function() {
      ws.send('hey!')
      stepBg ();
  }, 2000);
}

globalThis['processData'] = function () {};
globalThis['runWorklet'] = (worklet, params) => {
  return worklet(params);
}
