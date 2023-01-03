// if(expression) return => Any code that follows this pattern is a guard clause

/**
 * @description Function to generate code's html boiler plate
 * @param id - ID for the code block
 * @param message - Message when code block is copied
 * @returns HTMLPreElement
 */
function generateCodeBlock(id = "", message = "") {
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  const div = document.createElement("div");

  code.id = id;
  code.className = "scroll";
  div.className = "copy disabled";
  div.setAttribute("data-for", id);
  if (message && message != "") div.setAttribute("data-message", message);

  code.addEventListener(
    "touchstart",
    () => {
      code.classList.add("scrolling");
    },
    true
  );

  code.addEventListener(
    "touchend",
    () => {
      code.classList.remove("scrolling");
    },
    true
  );

  pre.appendChild(code);
  pre.appendChild(div);

  return pre;
}

/**
 * @description Function to create code blocks at a specific location
 */
function addCodeBlocks() {
  document.querySelectorAll(".code").forEach((el) => {
    const id = el.getAttribute("data-id");
    const message = el.getAttribute("data-message");
    el.appendChild(generateCodeBlock(id, message));
  });
}

/**
 *
 * @description Function to generate a notification div, can be used for other purposes
 * @param text - Text in the notification
 * @param id - ID for notification
 * @returns HTMLDivElement
 */
function generateNotification(text = "", id = "") {
  const div = document.createElement("div");
  div.id = id + "-notification";
  div.textContent = text;
  div.classList.add("notification");

  return div;
}

/**
 *
 * @description Function to display notification
 * @param text - Text in the notification
 * @param id - ID for notification
 * @returns undefined
 */
function displayNotification(text = "", id = "") {
  const notification = generateNotification(text, id);
  document.body.appendChild(notification);
  setTimeout(() => {
    // Clear notification automatically after 1 second
    document.body.removeChild(notification);
  }, 1000);
}

/**
 *
 * @description Fetch the code snippets
 * @returns XML string
 */
async function getSnippets() {
  const xmlFileName = document.body.getAttribute("data-file"); // Getting name to search for file associated with lesson

  const url = `${
    /.*github.*/.test(location.hostname) // check whether the host is github
      ? "/Full-Stack-Development-Lessons" // Add the repo name before path if yes
      : ""
  }/codes/${xmlFileName}.xml`; // The file name is used here

  // Fetch the related xml to the lesson
  return await (await fetch(url)).text();
}

/**
 * @description Add the code Snippets
 * @returns undefined
 */
async function addSnippetsToCodeBlocks() {
  const rawXML = await getSnippets();

  if (!rawXML) return;

  // Parse the xml using DOMParser in browser and get the root element
  const root = new DOMParser().parseFromString(
    rawXML,
    "text/xml" // Type of file to be parsed
  ).documentElement;

  // For each snippet locate position, highlight code and place it inside the respective code block
  root.childNodes.forEach((node) => {
    if (node.nodeName == "#text") return;
    const id = node.getAttribute("for");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = node.textContent.trim();
    hljs.highlightElement(el);
  });
}

/**
 * @description Add the feature to copy a code block with a button at the side
 * @returns undefined
 */
function generateCopyEvents() {
  document.querySelectorAll(".code pre > div.copy").forEach((el) => {
    // Make the copy button visible
    el.classList.remove("disabled");
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-for");
      if (!id) return; // Guard against undefined id

      // Dispatch a custom event called copycode
      const copyCodeEvent = new Event("copycode");

      copyCodeEvent.data = {
        id: id,
        message: el.getAttribute("data-message"),
      };

      window.dispatchEvent(copyCodeEvent);
    });
  });
}

/**
 *
 * @description Function to copy code using clipboard
 * @param event - Event object for copying to clipboard using navigator.clipboard
 * @returns undefined
 */
function copyCodeUsingClipboard(event) {
  if (!event || event.type != "copycode") throw new Error("Event invalid");
  if (!navigator.clipboard) throw new Error("Clipboard unavailable");
  if (!event.data.id || event.data.id == "") return;

  const el = document.getElementById(id);

  navigator.clipboard
    .writeText(el.textContent) // Returns a Promise
    .then(() => {
      console.log("here");
      displayNotification(event.data.message ?? "Copied Code!", event.data.id);
    })
    .catch(() => {
      displayNotification("Could not Copy!", event.data.id);
    });
}

/**
 *
 * @description Function to copy code using execCommand
 * @param event Event object for copying to clipboard execCommand which is deprecated
 * @returns undefined
 */
function copyCodeUsingExecCommand(event) {
  if (event.type != "copycode") throw new Error("Event invalid");
  const el = document.getElementById(event.data.id);
  const range = document.createRange();
  range.selectNodeContents(el);

  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);

  document.execCommand("copy");
  window.getSelection().removeAllRanges();

  displayNotification(event.data.message ?? "Copied Code!", event.data.id);
}

/**
 * @description Listen to the custom even called "copycode"
 * @returns undefined
 */
function addCopyEventListeners() {
  window.addEventListener("copycode", (event) => {
    // Since execCommand has been deprecated we have to use navigator.clipbaord
    // Some error handling
    try {
      copyCodeUsingClipboard(event);
    } catch {
      try {
        copyCodeUsingExecCommand(event);
      } catch (err) {
        console.error(err);
        displayNotification("Could not Copy", event.data.id);
      }
    }
  });
}

/**
 * @description IIFE => Immediately Invoked Function Expression
 * @brief This IIFE executes as soon as the script is loaded, hence the name
 */
(async function onload() {
  addCodeBlocks();
  await addSnippetsToCodeBlocks();
  generateCopyEvents();
  addCopyEventListeners();
})();
