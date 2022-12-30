function filterHtml(html = "") {
  let codes = {
    "<": "&lt;",
    ">": "&gt;",
  };

  let filteredHtml = "";

  for (let i = 0; i < html.length; i++) {
    let replacement = codes[html[i]];
    filteredHtml += replacement ? replacement : html[i];
  }

  return filteredHtml;
}

function generateNotification(text = "", id = "") {
  let div = document.createElement("div");
  div.id = id + "-notification";
  div.textContent = text;
  div.classList.add("notification");

  return div;
}

let fileName = document.body.getAttribute("data-file");

async function onload() {
  let url = `/codes/${fileName}.xml`;
  if (/.*github.*/gm.test(location.hostname)) {
    //Full-Stack-Development-Lessons
    url = "/Full-Stack-Development-Lessons/" + url;
  }
  await fetch(`/codes/${fileName}.xml`)
    .then((response) => response.text())
    .then((rawXML) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(rawXML, "text/xml");

      const root = xml.documentElement;

      root.childNodes.forEach((node) => {
        let id = node.nodeName == "#text" ? null : node.getAttribute("for");
        console.log(id);

        if (id) {
          let el = document.getElementById(id);

          if (el) {
            el.innerHTML = filterHtml(node.textContent.trim());
            hljs.highlightElement(el);
          }
        }
      });
    });

  document.querySelectorAll(".copy").forEach((el) => {
    el.addEventListener("click", () => {
      let id = el.getAttribute("data-for");
      let range = document.createRange();
      let code = document.getElementById(el.getAttribute("data-for"));

      range.selectNodeContents(code);

      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);

      let notification = generateNotification(
        el.getAttribute("data-message"),
        id
      );

      document.body.appendChild(notification);

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 1000);

      document.execCommand("copy");

      window.getSelection().removeAllRanges();
    });
  });
}

onload();
