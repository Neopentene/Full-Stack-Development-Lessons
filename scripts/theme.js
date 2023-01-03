document.querySelectorAll(".scroll").forEach((el) => {
  el.addEventListener(
    "touchstart",
    () => {
      el.classList.add("scrolling");
    },
    true
  );

  el.addEventListener(
    "touchend",
    () => {
      el.classList.remove("scrolling");
    },
    true
  );
});
