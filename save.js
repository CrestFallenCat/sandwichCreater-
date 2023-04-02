// Retrieve the saved sandwiches from the session storage
const savedSandwiches = JSON.parse(sessionStorage.getItem("savedImages"));
const sandwichNames = JSON.parse(sessionStorage.getItem("allTheNames"));

// Get a reference to the drop-down menu element
const sortSelect = document.getElementById("sort-options");

let sandwichContainerArray = [];

let ratingDetails = JSON.parse(sessionStorage.getItem("ratingDetails")) || [];
console.log(ratingDetails);

if (savedSandwiches) {
  // Get a reference to the container element
  const mainContainer = document.querySelector(".main-container");

  // If saved sandwiches are found in storage
  if (savedSandwiches) {
    Object.values(savedSandwiches).forEach((sandwich, index) => {
      // only create a new div if there are elements in the sandwich.images array
      if (sandwich.images && sandwich.images.length > 0) {
        // Create a new div element to hold the sandwich images
        const sandwichContainer = document.createElement("div");
        sandwichContainer.className = "sandwich-container";

        sandwichContainerArray.push(sandwichContainer);

        mainContainer.appendChild(sandwichContainer);

        // Create a new div element to hold the sandwich name
        const nameContainer = document.createElement("div");
        nameContainer.className = "sandwich-name";
        nameContainer.innerText = sandwichNames[index];
        sandwichContainer.appendChild(nameContainer);

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
            });
          });
        });
      }
    });
  }
}

// copy of original order of sandwich containers
const originalOrder = [...sandwichContainerArray];
console.log(originalOrder);

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
