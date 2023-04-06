// Retrieve the saved sandwiches from the session storage
const savedSandwiches = JSON.parse(sessionStorage.getItem("savedImages"));
const sandwichNames = JSON.parse(sessionStorage.getItem("allTheNames"));

// Get a reference to the drop-down menu element
const sortSelect = document.getElementById("sort-options");

let sandwichContainerArray = [];

let ratingDetails = JSON.parse(sessionStorage.getItem("ratingDetails")) || [];

let containerCount = -1;
let containerId;

if (savedSandwiches) {
  // Get a reference to the container element
  const mainContainer = document.querySelector(".main-container");

  // If saved sandwiches are found in storage

  if (savedSandwiches) {
    // Get a reference to the container element
    const mainContainer = document.querySelector(".main-container");

    // Loop through each saved sandwich
    Object.values(savedSandwiches).forEach((sandwich, index) => {
      // only create a new div if there are elements in the sandwich.images array
      if (sandwich.images && sandwich.images.length > 0) {
        // Create a new div element to hold the sandwich images
        const sandwichContainer = document.createElement("div");
        sandwichContainer.className = "sandwich-container";

        sandwichContainer.id = sandwich.id;
        sandwich.images.reverse();
        sandwichContainerArray.push(sandwichContainer);
        mainContainer.appendChild(sandwichContainer);

        // add a cross to the corner of the sandwich container so that it can be removed
        const containerCross = document.createElement("p");
        containerCross.className = "container-cross";
        containerCross.innerText = "X";
        sandwichContainer.appendChild(containerCross);

        const crossIcon = document.querySelectorAll(".container-cross");

        // adding event listener to each cross icon
        crossIcon.forEach((crossIcon) => {
          crossIcon.addEventListener("click", () => {
            // parentElement that contains the cross is the container it is associated with
            const container = crossIcon.parentElement;

            const containerIndex = container.parentNode
              ? Array.from(container.parentNode.children).indexOf(container)
              : -1;

            console.log(container);
            console.log(container.parentNode);
            // Use the container index to remove the corresponding name from the sandwichNames array
            sandwichNames.splice(containerIndex, 1);

            // Store the updated sandwich names array in session storage with a unique key
            sessionStorage.setItem(
              "allTheNames",
              JSON.stringify(sandwichNames)
            );

            //  obtaining the unique ID associated with each container
            const sandwichId = container.id;

            // delete keyword used to remove a property from  the object in the saved sandwiches array at the
            // position of the containers index
            delete savedSandwiches[sandwichId];
            // Update the items in storage after removal of an entire sandwich container
            sessionStorage.setItem(
              "savedImages",
              JSON.stringify(savedSandwiches)
            );

            if (sessionStorage.getItem("ratingDetails")) {
              const ratingDetails =
                JSON.parse(sessionStorage.getItem("ratingDetails")) || [];
              if (Array.isArray(ratingDetails)) {
                // obtain the unique ID associated with each container
                const sandwichId = container.id;
                // use the ID to remove the corresponding rating info from the ratingDetails array
                delete ratingDetails[sandwichId];
                sessionStorage.setItem(
                  "ratingDetails",
                  JSON.stringify(ratingDetails)
                );
              }
            }

            // This removes the container element from the DOM only
            container.remove();
          });
        });

        // Create a new div element to hold the sandwich name
        const nameContainer = document.createElement("div");
        nameContainer.className = "sandwich-name";
        nameContainer.innerText = sandwichNames[index];
        sandwichContainer.appendChild(nameContainer);

        const formToBuy = document.createElement("div");
        formToBuy.className = "form-div";
        sandwichContainer.appendChild(formToBuy);
        const buyButton = document.createElement("button");
        buyButton.className = "buy-button";
        buyButton.innerText = "Buy";
        formToBuy.appendChild(buyButton);

        // click function to create the form element which will appear for the user when 'buy' is clicked
        buyButton.addEventListener("click", function () {
          let form = formToBuy.querySelector(".buy-form");
          if (form) {
            formToBuy.removeChild(form);
          } else {
            form = document.createElement("form");
            form.setAttribute("class", "buy-form");
            formToBuy.appendChild(form);
          }

          // create text input fields
          const nameInput = document.createElement("input");
          nameInput.type = "text";
          nameInput.name = "name";
          nameInput.placeholder = "Full Name";
          form.appendChild(nameInput);

          const addressInput = document.createElement("input");
          addressInput.type = "text";
          addressInput.name = "address";
          addressInput.placeholder = "Address";
          form.appendChild(addressInput);

          const submitButton = document.createElement("input");
          submitButton.type = "submit";
          submitButton.value = "submit";
          form.appendChild(submitButton);
          // animate the boughtImage element to slide down into the sandwich container when the form is submitted

          form.addEventListener("submit", function (event) {
            event.preventDefault();
            // image that appears after submit is clicked
            const boughtImage = document.createElement("img");
            boughtImage.src = "pics/submit.jpeg";
            boughtImage.id = "creature";
            sandwichContainer.appendChild(boughtImage);

            setTimeout(() => {
              document.getElementById("creature").style.animation =
                "fadeOut 1s ease-out";
            }, 3000);
            // remove the image element from the DOM after the animation is complete
            setTimeout(() => {
              sandwichContainer.removeChild(boughtImage);
            }, 4000);
          });
        });

        // Check if there are any images in the sandwich
        sandwich.images.reverse();
        const bunUnderIndex = sandwich.images.indexOf("./pics/bunUnder.PNG");

        // Loop through the images in the sandwich and create an image element for each one
        sandwich.images.forEach((src, index) => {
          const imgElement = document.createElement("img");
          imgElement.src = src;

          if (index === bunUnderIndex) {
            imgElement.style.zIndex = sandwich.images.length;
          } else {
            imgElement.style.zIndex = sandwich.images.length - index;
          }

          sandwichContainer.appendChild(imgElement);
        });

        // Create a new div element to hold the sandwich rating
        const ratingContainer = document.createElement("div");
        ratingContainer.className = "sandwich-rating";

        const ratingText = document.createElement("div");
        ratingText.innerText = "Sandwich rating:";
        ratingText.className = "rating-text";

        ratingContainer.appendChild(ratingText);

        // Loop through the rating and create an image element for each one
        for (let i = 0; i < 5; i++) {
          const imgElement = document.createElement("img");
          imgElement.src = "pics/sandwich-small.png";
          imgElement.className = "sandwich";
          ratingContainer.appendChild(imgElement);
        }

        // Create a new img element to hold the reset button image
        const resetImg = document.createElement("img");
        resetImg.src = "pics/reset.png";
        resetImg.className = "reset-rating";

        // Add click event listener to the reset image
        resetImg.addEventListener("click", () => {
          ratingContainer.classList.remove("disabled");
          ratingImages.forEach((img) => {
            img.classList.remove("active");
          });
          outOfFive = ["~"];
          ratingScore.innerText = `${outOfFive}/5`;
        });

        sandwichContainer.appendChild(resetImg);

        // Append the rating container to the sandwich container
        sandwichContainer.appendChild(ratingContainer);

        // Add click event listener to each rating image in the container
        const ratingImages = ratingContainer.querySelectorAll("img");

        let outOfFive = ["~"];

        const ratingScore = document.createElement("div");
        ratingScore.innerText = `${outOfFive}/5`;
        ratingScore.className = "rating-score";

        sandwichContainer.appendChild(ratingScore);

        // collecting all the details within sandwich container and storing them in a variable
        const sandwichContainerDetails = document.querySelectorAll(
          ".sandwich-container"
        );

        // this will iterate over each element in the array and collect the details of the rating elements  for the current sandwich container
        sandwichContainerDetails.forEach((sandwichContainer, sandwichIndex) => {
          const ratingScore = sandwichContainer.querySelector(".rating-score");
          const ratingContainer =
            sandwichContainer.querySelector(".sandwich-rating");
          const ratingImages = ratingContainer.querySelectorAll("img");

          // this retrieves the rating details from session storage, if there is currently no data, rating details is set to an empty array
          let ratingDetails =
            JSON.parse(sessionStorage.getItem("ratingDetails")) || [];

          // this will append the rating score to the sandwich container so it is visible in the dom
          sandwichContainer.appendChild(ratingScore);

          /* extracts rating for current sandwich container
          filters the array or elements where the first value matches the current sandwich index
          map array to only show rating value*/
          const rating = ratingDetails
            .filter((sandwich) => sandwich[0] === sandwichIndex)
            .map((sandwich) => sandwich[1])[0];

          // If a rating was found, apply the correct classes to the rating images
          if (rating !== undefined) {
            ratingImages.forEach((ratingImage, ratingIndex) => {
              if (ratingIndex < rating) {
                ratingImage.classList.add("active");
              } else {
                ratingImage.classList.remove("active");
              }
            });
            ratingContainer.classList.add("disabled");
            ratingScore.innerText = `${rating}/5`;
          }

          ratingImages.forEach((ratingImage, ratingIndex) => {
            ratingImage.addEventListener("click", () => {
              // Disable the rating container after clicking
              ratingContainer.classList.add("disabled");

              // Add active class to clicked image and previous images
              for (let i = 0; i <= ratingIndex; i++) {
                ratingImages[i].classList.add("active");
              }

              // Get the current rating
              const rating = ratingIndex + 1;

              // Get the existing rating details from sessionStorage
              let ratingDetails =
                JSON.parse(sessionStorage.getItem("ratingDetails")) || [];
              console.log(ratingDetails);

              // Find the index of the sandwich in the rating details array
              const sandwichIndex = Array.from(
                sandwichContainerDetails
              ).indexOf(sandwichContainer);

              // Update the rating value for the current sandwich container index
              ratingDetails = ratingDetails.filter(
                (sandwich) => sandwich[0] !== sandwichIndex
              );

              ratingDetails.push([sandwichIndex, rating]);

              // Display the rating
              ratingScore.innerText = `${rating}/5`;

              // Save the rating details in sessionStorage
              sessionStorage.setItem(
                "ratingDetails",
                JSON.stringify(ratingDetails)
              );
              location.reload();
            });
          });
        });
      }
    });
  }
}

// copy of original order of sandwich containers
const originalOrder = [...sandwichContainerArray];

// Add an event listener to the drop-down menu
sortSelect.addEventListener("change", () => {
  const mainContainerSort = document.querySelector(".main-container");
  const selectedOption = sortSelect.value;

  // convert contents of sandwich containers into array form, in order to easily reverse
  const sandwichContainers = Array.from(
    mainContainerSort.querySelectorAll(".sandwich-container")
  );

  let sortedContainers;

  if (selectedOption === "Newest first") {
    sortedContainers = originalOrder.slice().reverse();
  } else if (selectedOption === "Oldest first") {
    sortedContainers = originalOrder;
  } else if (selectedOption === "Highest rated") {
    ratingDetails.sort((a, b) => b[1] - a[1]);
    sandwichContainers.sort((a, b) => {
      const ratingA =
        ratingDetails.find(
          (rating) => rating[0] === originalOrder.indexOf(a)
        )?.[1] || 0;
      const ratingB =
        ratingDetails.find(
          (rating) => rating[0] === originalOrder.indexOf(b)
        )?.[1] || 0;
      return ratingB - ratingA;
    });
    sortedContainers = sandwichContainers;
  } else if (selectedOption === "Lowest rated") {
    ratingDetails.sort((a, b) => a[1] - b[1]);
    sandwichContainers.sort((a, b) => {
      const ratingA =
        ratingDetails.find(
          (rating) => rating[0] === originalOrder.indexOf(a)
        )?.[1] || 0;
      const ratingB =
        ratingDetails.find(
          (rating) => rating[0] === originalOrder.indexOf(b)
        )?.[1] || 0;
      return ratingA - ratingB;
    });
    sortedContainers = sandwichContainers;
  }
  originalOrder.forEach((container) => {
    mainContainerSort.removeChild(container);
  });

  sortedContainers.forEach((container) => {
    mainContainerSort.appendChild(container);
  });
});
// ensure 'oldest first is always the first option selected on reload of page
sortSelect.value = "Oldest first";
