const removePreloader = () => {
  try {
    const ele = document.getElementById("ipl-progress-indicator");
    if (ele) {
      // fade out
      ele.classList.add("available");
      setTimeout(() => {
        // remove from DOM
        // ele.outerHTML = "";
        document.body.removeChild(ele);
      }, 1000);
    }
    document.body.style.pointerEvents = "unset";
  } catch (error) {
    console.log(error);
  }
};

// Auto Remove Preloader after some time in case some else function fails to invoke it!
setTimeout(removePreloader, 8000);

export default removePreloader;
