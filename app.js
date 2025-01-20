// Load the blazeface model which is optimized for TensorFlow.js
let model;
(async () => {
  // Load blazeface directly using the model API
  model = await blazeface.load();
  console.log("Model loaded successfully");
})();

// Helper function to load an image from a URL and preprocess it
async function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) =>
      reject("Image failed to load. Please check the URL.");
  });
}

// Main function to process the image and make predictions
async function processImage() {
  const imageUrl = document.getElementById("imageUrl").value;
  const resultDiv = document.getElementById("result");

  if (!imageUrl) {
    resultDiv.innerHTML =
      '<p style="color: red;">Please enter a valid image URL.</p>';
    return;
  }

  try {
    const img = await loadImage(imageUrl);
    resultDiv.innerHTML = `<img src="${imageUrl}" alt="Input Image">`;
    const predictions = await model.estimateFaces(img, false);

    if (predictions.length > 0) {
      // Create a canvas to draw the bounding boxes
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Draw boxes for each face
      predictions.forEach((prediction) => {
        const start = prediction.topLeft;
        const end = prediction.bottomRight;
        const width = end[0] - start[0];
        const height = end[1] - start[1];

        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.strokeRect(start[0], start[1], width, height);
      });

      resultDiv.innerHTML = "";
      resultDiv.appendChild(canvas);
    } else {
      resultDiv.innerHTML += `<p>No faces detected</p>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
  }
}
document
  .getElementById("analyzeButton")
  .addEventListener("click", processImage);

console.log("TensorFlow.js version:", tf.version);
