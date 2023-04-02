// Retrieve the saved sandwiches from the session storage
const savedSandwiches = JSON.parse(sessionStorage.getItem("savedImages"));
console.log(savedSandwiches);
if (savedSandwiches) {
  // Get a reference to the container element
  const mainContainer = document.querySelector(".main-container");

  // If saved sandwiches are found in storage
  if (savedSandwiches) {
    Object.values(savedSandwiches).forEach((sandwich) => {
      // only create a new div if there are elements in the sandwich.images array
      if (sandwich.images && sandwich.images.length > 0) {
        // Create a new div element to hold the sandwich images
        const sandwichContainer = document.createElement("div");
        sandwichContainer.className = "sandwich-container";
        mainContainer.appendChild(sandwichContainer);

        // Check if there are any images in the sandwich
        sandwich.images.reverse();
        const bunUnderIndex = sandwich.images.indexOf("./pics/bunUnder.PNG");

        // Loop through the images in the sandwich and create an image element for each one
        sandwich.images.forEach((src, index) => {
          const imgElement = document.createElement("img");
          imgElement.src = src;

          imgElement.style.top = `${index * 90}px`; // adjust the vertical position
          // Set the z-index property

          if (index === bunUnderIndex) {
            imgElement.style.zIndex = sandwich.images.length;
          } else {
            imgElement.style.zIndex = sandwich.images.length - index;
          }

          sandwichContainer.appendChild(imgElement);
        });
      }
    });
  }
}
