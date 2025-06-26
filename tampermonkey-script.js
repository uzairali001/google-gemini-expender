(function () {
  "use strict";

  const maxExpandedWidth = "1200px";
  const maxInputExpandedWidth = "1000px";
  const initializeDelay = 5000;

  let isExpended = localStorage.getItem("expanded") === "true";

  let inputContainer = null;
  let chatContainers = null;
  let expendButton = null;

  const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape,
  });

  function initialize() {
    inputContainer = document.querySelector(".input-area-container");
    chatContainers = document.querySelectorAll(".conversation-container");
    chatContainers.forEach((x) => {
      x.style.transition = "max-width 450ms ease";
    });
    inputContainer.style.transition = "max-width 450ms ease";

    initializeExpandButton();

    handleExpand(isExpended);

    function initializeExpandButton() {
      const toolboxDrawer = document.querySelector("toolbox-drawer > div");

      expendButton = document.createElement("button");
      cloneAttributes(toolboxDrawer.querySelector("button"), expendButton);

      expendButton.addEventListener("click", () => {
        handleExpand(isExpended);
      });

      const icon = document.createElement("span");
      // cloneAttributes(toolboxDrawer.querySelector("mat-icon"), icon);
      icon.classList.add(
        "mat-icon",
        "notranslate",
        "mat-mdc-list-item-icon",
        "menu-icon",
        "gds-icon-l",
        "google-symbols",
        "mat-ligature-font",
        "mat-icon-no-color",
        "mdc-list-item__start",
        "ng-star-inserted"
      );
      icon.innerHTML = escapeHTMLPolicy.createHTML(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M295 183c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l135-135 0 86.1c0 13.3 10.7 24 24 24s24-10.7 24-24l0-144c0-13.3-10.7-24-24-24L344 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l86.1 0L295 183zM217 329c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L48 430.1 48 344c0-13.3-10.7-24-24-24s-24 10.7-24 24L0 488c0 13.3 10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-86.1 0L217 329z"/></svg>'
      );
      icon.style.maxWidth = "18px";
      icon.style.rotate = "90deg";

      const btnText = document.createElement("span");
      btnText.innerText = "Expand";

      expendButton.append(icon, btnText);

      const toolbarItem = document.createElement("toolbox-drawer-item");
      cloneAttributes(toolboxDrawer.querySelector("toolbox-drawer-item"), toolbarItem);

      toolbarItem.append(expendButton);

      toolboxDrawer.append(toolbarItem);
    }
  }

  function cloneAttributes(fromElement, toElement) {
    const srcAttributes = fromElement.attributes;
    for (const {name, value} of srcAttributes) {
      toElement.setAttribute(name, value);
    }
  }

  function handleExpand(expanded) {
    if (expanded) {
      inputContainer.style.maxWidth = maxInputExpandedWidth;
      chatContainers.forEach((x) => {
        x.style.maxWidth = maxExpandedWidth;
      });
      expendButton.classList.add("is-selected");
    } else {
      inputContainer.style.maxWidth = "";
      chatContainers.forEach((x) => {
        x.style.maxWidth = "";
      });
      expendButton.classList.remove("is-selected");
    }

    isExpended = !isExpended;
    localStorage.setItem("expanded", expanded);
  }

  /**
   * Continuously checks for a DOM element and calls a function when found,
   * with an optional maximum wait time.
   * @param {number} maxWaitTime - Maximum time (in milliseconds) to wait for the element.
   */
  function checkAndInitializeWithTimeout(maxWaitTime) {
    const startTime = performance.now(); // Record the start time

    function check() {
      const targetElement = document.querySelector("toolbox-drawer toolbox-drawer-item button");
      const currentTime = performance.now();

      if (targetElement) {
        initialize();
      } else if (currentTime - startTime < maxWaitTime) {
        // If the element is not found and within the time limit, check again
        requestAnimationFrame(check);
      } else {
        console.warn(`Element not found within ${maxWaitTime}ms. Aborting check.`);
      }
    }

    // Start the continuous checking
    requestAnimationFrame(check);
  }

  // Example usage: Try to find the element for a maximum of 10 seconds (10000 milliseconds)
  checkAndInitializeWithTimeout(10_000);

})();
