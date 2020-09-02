console.log("from outside");
chrome.runtime.onMessage.addListener(function (request) {
  console.log(request, "!!!!!");
  console.log("from inside");
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

    for (var i = 0; i < localStorage.length; i++) {
      console.log(i);
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
        const name = attr.name;
        const val = attr.value;
        temp[attr.name] = attr.value;
      }
      const stringObject = JSON.stringify(temp);
      chrome.storage.local.set({ id: temp }, function () {
        console.log("Value is set to " + temp);
      });

      localStorage.setItem(id, stringObject);
    }

    function hideStoredElement(i) {
      console.log("before getting local storage");
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
    console.log("request is false");
    alert("false");
  }
  alert("should be the second alert");

  // sendResponse(document.documentElement.innerHTML, "hi?");
  //   const test = document.documentElement.innerHTML();
  //   console.log(test, "is it working??");
});

// hoverBox = document.createElement("div");
// hoverBox.style.position = "absolute";
// hoverBox.style.border = "solid red 1px";
// hoverBox.style.zIndex = "0";
// alert("wi");

// document.body.appendChild(hoverBox);
// let event;
// let previousElement;
// let element;
// let elementPosition;

// for (var i = 0; i < localStorage.length; i++) {
//   console.log(i);
//   const storedElemented = hideStoredElement(i);
//   if (storedElemented != undefined) {
//     console.log(storedElemented, "from the loop");
//     storedElemented.style.display = "none";
//   }
// }

// document.addEventListener("mousemove", (e) => {
//   element = e.target;

//   // not sure whats going on in the if statment
//   if (element === hoverBox) {
//     hoverdElement = document.elementsFromPoint(e.clientX, e.clientY)[1];
//     if (hoverdElement === previousElement) {
//       return;
//     } else {
//       element = hoverdElement;
//     }
//   } else {
//     previousElement = element;
//   }

//   if (element != hoverBox) {
//     elementPosition = element.getBoundingClientRect();
//   }

//   const boxBorder = 5;
//   hoverBox.style.width = elementPosition.width + boxBorder * 2 + "px";
//   hoverBox.style.height = elementPosition.height + boxBorder * 2 + "px";
//   // not sure why
//   hoverBox.style.top = elementPosition.top + window.scrollY - boxBorder + "px";
//   hoverBox.style.left =
//     elementPosition.left + window.scrollX - boxBorder + "px";
// });

// document.addEventListener("click", (e) => {
//   console.log(
//     e.target,
//     element,
//     "is it the same element that I hoverd and clicked"
//   );
//   if (element != hoverBox) {
//     storeElement(element.attributes);
//     element.style.display = "none";
//   } else {
//     alert("please click again");
//   }
// });

// function storeElement(obj) {
//   const id = Math.floor(Math.random() * 100000);
//   console.log(obj);
//   let temp = {};
//   for (const [key, attr] of Object.entries(obj)) {
//     const name = attr.name;
//     const val = attr.value;
//     temp[attr.name] = attr.value;
//   }
//   const stringObject = JSON.stringify(temp);
//   localStorage.setItem(id, stringObject);
// }

// function hideStoredElement(i) {
//   const storedItem = localStorage.getItem(localStorage.key(i));
//   // add a shild that make sure it would hide only the dom element
//   const storedObject = JSON.parse(storedItem);
//   // make better naming
//   const elm = getElementByAttribute(storedObject);
//   return elm;
// }

// function getElementByAttribute(node) {
//   // make this function more cleaner, use the class as a last option
//   for (const [key, value] of Object.entries(node)) {
//     switch (key) {
//       case "id":
//         return document.getElementById(value);

//       case "class":
//         const classElement = document.getElementsByClassName(node.className);
//         if (classElement.length === 1) {
//           return element[0];
//         }
//         break;

//       default:
//         const x = document.querySelector(`[${key}="${value}"]`);
//         return document.querySelector(`[${key}="${value}"]`);
//     }
//   }
// }
