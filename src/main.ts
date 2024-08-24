import "./style.css";
import Canvas from "./components/canvas";
import Scroll from "./components/scroll";

// createApp function: Initializes the Scroll
//  and Canvas components and starts the rendering loop.
function createApp() {
  const scroll = new Scroll();
  const canvas = new Canvas();



  // render function: Continuously updates the canvas
  // based on the current scroll position,
  // using requestAnimationFrame to keep the animation smooth.
  function render() {
    const s = scroll.getScroll();
    canvas.render(s);
    requestAnimationFrame(render);
  }

  render();
}

export default createApp();
