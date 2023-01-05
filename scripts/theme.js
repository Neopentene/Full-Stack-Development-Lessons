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

let buttonToTop = document.querySelector(".to-top");

if (buttonToTop) {
  buttonToTop.className = "to-top hide";

  let anchorID = buttonToTop.getAttribute("data-target");
  let anchor = document.getElementById(anchorID);

  if (anchor) {
    let observer = new IntersectionObserver((elements) => {
      elements.forEach((el) => {
        if (!el.isIntersecting) {
          buttonToTop.classList.replace("hide", "show");
          return;
        }
        buttonToTop.classList.replace("show", "hide");
      });
    });

    observer.observe(anchor);

    buttonToTop.addEventListener("click", () => {
      window.scrollTo(0, 0);
    });
  }
}
