import Lenis from "lenis";
import "../lenis.css";

// createScroll function: Initializes the Lenis instance and sets up the scroll handling.
function createScroll() {
  let scroll = 0;
  const lenis = new Lenis();

  lenis.on("scroll", (e: Lenis) => {
    scroll = e.scroll as number;
  });

  // getScroll function: Returns the current scroll position.
  function getScroll() {
    return scroll;
  }
  // raf function: Updates the scroll animation frame by frame using requestAnimationFrame.
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  // Event listeners: Handle scroll events and window resizing.
  window.addEventListener("resize", () => {
    lenis.resize();
  });

  return {
    getScroll,
  };
}

export default createScroll;
