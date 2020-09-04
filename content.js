chrome.runtime.onMessage.addListener(function (request) {
  if (request === true) {
    hoverBox = document.createElement("div");
    hoverBox.style.position = "absolute";
    hoverBox.style.border = "solid red 1px";
    hoverBox.style.zIndex = "0";
    // alert("hiding elements");

    document.body.appendChild(hoverBox);
    let previousElement;
    let element;
    let elementPosition;
    let url = window.location.hostname;

    chrome.storage.sync.get(null, function (items) {
      console.log(items, "get all stored items");
    });

    chrome.storage.sync.get(url, function (items) {
      if (items[url] != undefined) {
        items[url].forEach((elem) => {
          const storedElement = getElementByAttribute(elem);
          // make it more cleaner
          if (storedElement != undefined) {
            console.log(storedElement);
            storedElement.style.display = "none";
          }
        });
        console.log(items, "getting the url stored items");
      }
    });

    document.addEventListener("mousemove", (e) => {
      element = e.target;

      // not sure whats going on in the if statment
      if (element === hoverBox) {
        hoverdElement = document.elementsFromPoint(e.clientX, e.clientY)[1];
        if (hoverdElement === previousElement) {
          return;
        } else {
          element = hoverdElement;
        }
      } else {
        previousElement = element;
      }

      if (element != hoverBox) {
        elementPosition = element.getBoundingClientRect();
      }

      const boxBorder = 5;
      hoverBox.style.width = elementPosition.width + boxBorder * 2 + "px";
      hoverBox.style.height = elementPosition.height + boxBorder * 2 + "px";
      // not sure why
      hoverBox.style.top =
        elementPosition.top + window.scrollY - boxBorder + "px";
      hoverBox.style.left =
        elementPosition.left + window.scrollX - boxBorder + "px";
    });

    document.addEventListener("click", (e) => {
      if (element != hoverBox) {
        storeElement(element.attributes);
        element.style.display = "none";
      } else {
        alert("please click again");
      }
    });

    function storeElement(obj) {
      const id = Math.floor(Math.random() * 100000);
      let temp = {};
      for (const [key, attr] of Object.entries(obj)) {
        temp[attr.name] = attr.value;
      }

      let elementAttributes = {};

      if (Object.keys(temp).length != 0) {
        elementAttributes = temp;

        chrome.storage.sync.get(url, function (items) {
          console.log(items, "previose stored element");
          console.log(elementAttributes, "the new element to be stored");
          let existingObject = {};
          if (items[url] === undefined) {
            existingObject[url] = [elementAttributes];
          } else {
            items[url].push(elementAttributes);
            existingObject[url] = items[url];
          }

          chrome.storage.sync.set(existingObject, function () {
            console.log(existingObject, "values has been stored");
          });
        });
      }
    }

    function getElementByAttribute(node) {
      // make this function more cleaner, use the class as a last option
      console.log(node, "getting the attribute from element");
      for (const [key, value] of Object.entries(node)) {
        switch (key) {
          case "id":
            return document.getElementById(value);

          case "class":
            const classElement = document.getElementsByClassName(node.class);
            console.log(node.class);
            if (classElement.length === 1) {
              return classElement[0];
            }
            break;

          default:
            const x = document.querySelector(`[${key}="${value}"]`);
            return document.querySelector(`[${key}="${value}"]`);
        }
      }
    }
  } else if (request === false) {
    chrome.storage.sync.clear(function () {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
      console.log("request is false ");
    });
    alert("store has been deleted");
  }
});
