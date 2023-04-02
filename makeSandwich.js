// Get all food buttons
const foodButtons = document.querySelectorAll(".food-button");
// container for ingredient images
const container = document.querySelector(".container");
// div for the count down of ingredients:
const countdown = document.querySelector(".countdown");
const nameTheSandwich = document.getElementById("dialogOverlay");
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

let ingredientCount = 0;
countdown.innerHTML = ingredientCount + "/" + 7;

function ingredientCountReset() {
  ingredientCount = 0;
  countdown.innerHTML = ingredientCount + "/" + 7;
}

function updateChoose() {
  if (ingredientCount === 7) {
    document.getElementById("choose").textContent = "You've chosen enough! 😠";
  } else {
    document.getElementById("choose").textContent = "Choose up to seven";
  }
}

function updateButtonStatus() {
  if (imageOrder.length >= 6) {
    foodButtons.forEach((button) => {
      button.disabled = true;
      button.classList.add("disabled");
    });
  }
  if (imageOrder.length < 6) {
    foodButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove("disabled");
    });
  }
}

function slideDown(img) {
  ingredientCount += 1;
  countdown.innerHTML = ingredientCount + "/" + 7;

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
  }, 10);
  updateButtonStatus();

  updateChoose();
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
  ingredientCountReset();
  updateChoose();
  updateButtonStatus();
}
//
//
//
//
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
    // to reveal the box for user to name the sandwich
    nameTheSandwich.style.visibility = "visible";

    ingredientCountReset();
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
    ingredientCount -= 1;
  }
  countdown.innerHTML = ingredientCount + "/" + 7;
  if (imageOrder.length > 0) {
    const lastImgId = imageOrder.pop();

    const lastImg = document.getElementById(lastImgId);
    if (lastImg) {
      const lastImgHeight = lastImg.clientHeight;
      lastImg.remove();
      currentPosition += 120;
    }
  }
  if (imageOrder.length === 6) {
    foodButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove("disabled");
    });
  }

  updateChoose();
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

// Loop through food buttons
foodButtons.forEach((button) => {
  // Add click event listener to button
  button.addEventListener("click", () => {
    // Save the original button text in a variable
    const originalText = button.textContent;
    // Change button text to "Added"
    if (button.id === "bug-button") {
      button.textContent = "Really?";
    } else {
      button.textContent = "Added!";
    }
    button.disabled = true;
    // Add "added" class to button
    button.classList.add("added");
    // Use setTimeout to return button text and remove class after 1 second
    setTimeout(() => {
      button.disabled = false;
      button.textContent = originalText;
      if (imageOrder.length === 7) {
        button.disabled = true;
      }
    }, 300);
  });
});

let allTheNames = [];
// might not need
let lastNameEntered = [];

function sandwichName() {
  let nameOfSandwich = document.getElementById("sandwichName").value;
  lastNameEntered.push(nameOfSandwich);
  console.log("name of last sandwich entered: " + lastNameEntered);
  nameTheSandwich.style.visibility = "hidden";
  document.getElementById("sandwichName").value = "";

  // Retrieve existing sandwich names array from session storage or create a new one if it doesn't exist
  let allTheNames = JSON.parse(sessionStorage.getItem("allTheNames")) || [];
  allTheNames.push(nameOfSandwich);

  // Store the updated sandwich names array in session storage with a unique key
  sessionStorage.setItem("allTheNames", JSON.stringify(allTheNames));

  // Retrieve the updated sandwich names array from session storage and log it to the console
  let sessionSandwichNames = JSON.parse(sessionStorage.getItem("allTheNames"));
  // console.log(sessionSandwichNames);
  console.log("all the array items " + allTheNames);

  // reset all the food items in the container once the sandwich has been saved and named
  reset(container);

  // container
  let displayNameContainer = document.getElementById("sandwichNameDisplayed");
  let displayNameElement = document.createElement("p");

  displayNameElement.innerText = nameOfSandwich + "!";

  displayNameContainer.appendChild(displayNameElement);

  displayNameElement.style.opacity = 0;
  let fadeInInterval = setInterval(function () {
    displayNameElement.style.opacity =
      Number(displayNameElement.style.opacity) + 0.1;
    if (Number(displayNameElement.style.opacity) >= 1) {
      clearInterval(fadeInInterval);
    }
  }, 100);

  setTimeout(function () {
    let fadeOutInterval = setInterval(function () {
      displayNameElement.style.opacity =
        Number(displayNameElement.style.opacity) - 0.1;
      if (Number(displayNameElement.style.opacity) <= 0) {
        clearInterval(fadeOutInterval);
        displayNameContainer.removeChild(displayNameElement);
      }
    }, 100);
  }, 1500);
}

// the function enables the sandwich name box to close and submit upon enter
function onEnter(event) {
  if (event.key === "Enter") {
    sandwichName();
  }
}
