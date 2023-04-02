// container for ingredient images
const container = document.querySelector(".container");
// container.style.position = "relative";

// all ingredient images
const bunUnder = document.querySelector("#bun-under");
const egg = document.querySelector("#egg");
const spoon = document.querySelector("#spoon");
const leaf = document.querySelector("#leaf");
const bacon = document.querySelector("#bacon");
const pickle = document.querySelector("#pickle");
const tomato = document.querySelector("#tomato");
const bug = document.querySelector("#bug");
const bunTop = document.querySelector("#bun-top");

// all ingredient buttons
const bunUnderButton = document.querySelector("#bun-under-button");
const eggButton = document.querySelector("#egg-button");
const spoonButton = document.querySelector("#spoon-button");
const leafButton = document.querySelector("#leaf-button");
const baconButton = document.querySelector("#bacon-button");
const pickleButton = document.querySelector("#pickle-button");
const tomatoButton = document.querySelector("#tomato-button");
const bugButton = document.querySelector("#bug-button");
const bunTopButton = document.querySelector("#bun-top-button");

// this function enables each image to appear and slide down into place

// this is the starting position of the first image and will store the last position of an image before the next is called.
let currentPosition = 0;
let imagePositions = [];
// empty array for the function to push images into in the correct order the buttons are pushed
let imageOrder = [];
let clickCount = {};

function slideDown(img) {
  img.style.position = "absolute";

  // create a new instance of the image element with a unique ID based on the number of times it has been clicked
  const cloneId = `${img.id}-${clickCount[img.id] || 0}`;
  const newImg = img.cloneNode(true);
  newImg.style.visibility = "visible";
  newImg.style.top = "-100%";
  newImg.style.marginTop = "-70px";
  newImg.id = cloneId;

  // add the new image element to the container
  container.appendChild(newImg);

  setTimeout(() => {
    const containerHeight = container.offsetHeight;
    const targetTop =
      currentPosition === 0
        ? containerHeight * 0.9
        : currentPosition - newImg.offsetHeight + 90;
    newImg.style.top = `${targetTop}px`;
    currentPosition = targetTop;

    // increment the click count for the image element
    clickCount[img.id] = (clickCount[img.id] || 0) + 1;

    // add the newImg to the imageOrder array
    imageOrder.push(cloneId);

    imageOrder.forEach((id, index) => {
      const imgElement = document.getElementById(id);
      if (imgElement) {
        imgElement.style.zIndex = (index + 1) * 10;
      }
    });

    console.log(imageOrder);
    console.log("current position after image added " + currentPosition);
  }, 10);
}

function reset(container) {
  // Clear the image order and positions arrays
  imageOrder = [];
  imagePositions = [];

  // Remove all images from the container, removing each first child until there are none left
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Reset the current position to the top of the container
  currentPosition = 0;

  // Reset the click count object
  clickCount = {};
}

function save() {
  // Get an array of the image sources in the correct order

  const savedSandwich = imageOrder.map((id) => {
    const imgElement = document.getElementById(id);
    if (imgElement) {
      return "./pics/" + imgElement.src.split("/").pop();
    }
    return null;
  });

  // Remove any null values from the array
  const filteredSavedSandwich = savedSandwich.filter((src) => src !== null);

  // Retrieve the existing saved sandwiches from the session storage
  const savedSandwiches =
    JSON.parse(sessionStorage.getItem("savedImages")) || {};

  // Create a new sandwich object
  const newSandwich = {
    id: Date.now(),
    images: filteredSavedSandwich,
  };

  // Add the new sandwich object to the saved sandwiches object
  savedSandwiches[newSandwich.id] = newSandwich;

  // Create a custom save dialog
  const saveDialog = document.createElement("div");
  saveDialog.id = "saveDialog";
  saveDialog.classList.add("dialog");

  const saveDialogHtml = `
    
    <div class="dialog-content">
    <button id="closeDialog">X</button>
    
    <h3>When you click 'OK' the sandwich you have created will be sent to your 'Saved' page, ok?</h3>
    <div class="button-container">
    <button id="saveOk">OK</button>
    </div>
    <div class="checkbox-container">
    <input type="checkbox" id="disableSavePrompt" />
    <label for="disableSavePrompt">Don't bother me with this again</label>
    </div>
    </div>
    `;

  saveDialog.innerHTML = saveDialogHtml;
  document.body.appendChild(saveDialog);

  // Add event listeners to the dialog buttons
  const saveOkBtn = document.getElementById("saveOk");
  const closeDialogBtn = document.getElementById("closeDialog");

  saveOkBtn.addEventListener("click", () => {
    // Save the sandwich
    sessionStorage.setItem("savedImages", JSON.stringify(savedSandwiches));

    // Check if the user wants to disable future save prompts
    const disableSavePrompt = document.getElementById("disableSavePrompt");
    if (disableSavePrompt.checked) {
      sessionStorage.setItem("disableSavePrompt", true);
    }

    // Close the dialog when ok is clicked
    saveDialog.remove();
  });

  // close if the cross is clicked
  closeDialogBtn.addEventListener("click", () => {
    saveDialog.remove();
  });

  // Check if the user has disabled future save prompts for this session
  const disableSavePrompt = sessionStorage.getItem("disableSavePrompt");
  if (disableSavePrompt) {
    saveOkBtn.click();
  }
}

function undo() {
  if (imageOrder.length > 0) {
    const lastImgId = imageOrder.pop();
    // const lastImgHeight = lastImgId.offsetHeight;
    const lastImg = document.getElementById(lastImgId);
    if (lastImg) {
      lastImg.remove();
      currentPosition += 200;
    }
    console.log("current position after undo " + currentPosition);
  }
}

// all ingredient buttons and the corresponding ID (or element)

const ingredientButtons = [
  { button: bunUnderButton, element: bunUnder },
  { button: eggButton, element: egg },
  { button: spoonButton, element: spoon },
  { button: leafButton, element: leaf },
  { button: baconButton, element: bacon },
  { button: pickleButton, element: pickle },
  { button: tomatoButton, element: tomato },
  { button: bugButton, element: bug },
  { button: bunTopButton, element: bunTop },
];

// loop to add an event lister and function call to the ingredient buttons
ingredientButtons.forEach(({ button, element }) => {
  button.addEventListener("click", function () {
    slideDown(element);
  });
});

// Get all food buttons
const foodButtons = document.querySelectorAll(".food-button");

// Loop through food buttons
foodButtons.forEach((button) => {
  // Add click event listener to button
  button.addEventListener("click", () => {
    // Save the original button text in a variable
    const originalText = button.textContent;
    // Change button text to "Added"
    button.textContent = "Added!";
    // Add "added" class to button
    button.classList.add("added");
    // Use setTimeout to return button text and remove class after 1 second
    setTimeout(() => {
      button.textContent = originalText;
    }, 1000);
  });
});
