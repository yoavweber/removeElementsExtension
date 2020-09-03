chrome.runtime.onMessage.addListener(function (request) {
  if (request === true) {
    hoverBox = document.createElement("div");
    hoverBox.style.position = "absolute";
    hoverBox.style.border = "solid red 1px";
    hoverBox.style.zIndex = "0";
    alert("wi");

    document.body.appendChild(hoverBox);
    let event;
    let previousElement;
    let element;
    let elementPosition;

    chrome.storage.sync.get(null, function (items) {
      // chrome.storage.sync.set(
      //   (items["20598"]["test"] = "updating it?"),
      //   function () {
      //     console.log("after setting the value");
      //   }
      // );
      // console.log(items["20598"], "first update");
      console.log(items, "from new local storage");
    });

    for (var i = 0; i < localStorage.length; i++) {
      const storedElemented = hideStoredElement(i);
      if (storedElemented != undefined) {
        console.log(storedElemented, "from the loop");
        storedElemented.style.display = "none";
      }
    }

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
      console.log(
        e.target,
        element,
        "is it the same element that I hoverd and clicked"
      );
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
        elementAttributes[id] = temp;
        let url = window.location.hostname;
        chrome.storage.sync.get(url, function (items) {
          let existingObject = {};
          existingObject[url] = Object.assign(elementAttributes, items[url]);

          chrome.storage.sync.set(existingObject, function () {
            console.log(existingObject, "values has been stored");
          });
        });
      }
    }

    function hideStoredElement(i) {
      // console.log(window.location.hostname, "get url");
      // let elm
      console.log("is this app running?");
      chrome.storage.sync.get(null, function (items) {
        // chrome.storage.sync.set(
        //   (items["20598"]["test"] = "updating it?"),
        //   function () {
        //     console.log("after setting the value");
        //   }
        // );
        // console.log(items["20598"], "first update");
        console.log(items, "from new local storage");
      });

      //checking if the element got updated
      // chrome.storage.sync.set("20598", function (items) {
      //   items["20598"]["test"] = "updating it?";
      // });

      // chrome.storage.sync.get("20598", function (items) {
      //   console.log(items, "is it updated?");
      // });

      const storedItem = localStorage.getItem(localStorage.key(i));
      console.log("after  getting local storage");
      // add a shild that make sure it would hide only the dom element
      const storedObject = JSON.parse(storedItem);
      // make better naming
      const elm = getElementByAttribute(storedObject);
      return elm;
    }

    function getElementByAttribute(node) {
      // make this function more cleaner, use the class as a last option
      console.log(node, "getting the attribute from element");
      for (const [key, value] of Object.entries(node)) {
        switch (key) {
          case "id":
            return document.getElementById(value);

          case "class":
            const classElement = document.getElementsByClassName(
              node.className
            );
            if (classElement.length === 1) {
              return element[0];
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
  alert("should be the second alert");

  // sendResponse(document.documentElement.innerHTML, "hi?");
  //   const test = document.documentElement.innerHTML();
  //   console.log(test, "is it working??");
});
