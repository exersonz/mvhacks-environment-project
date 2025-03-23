// The link to your model provided by Teachable Machine export panel
const URL = "./my_model/";

let model, labelContainer, maxPredictions;

// Load the image model and setup
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Set up the label container
    labelContainer = document.getElementById("resultText");
    labelContainer.innerHTML = "Model Loaded! Ready for predictions.";
}

// Call the init function to load the model
window.onload = () => {
    init();
};

// Preview image before classification
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById("preview").src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

// Predict waste category from image
async function predictWaste() {
    const imageElement = document.getElementById("preview");

    if (!imageElement.src) {
        document.getElementById("resultText").innerText = "Please upload an image first.";
        return;
    }

    if (!model) {
        document.getElementById("resultText").innerText = "Model is still loading. Please wait...";
        return;
    }

    try {
        const prediction = await model.predict(imageElement);
        let bestMatch = prediction.reduce((a, b) => (a.probability > b.probability ? a : b));

        // Display the predicted class
        document.getElementById("resultText").innerText = `This item belongs in: ${bestMatch.className}`;
    } catch (error) {
        console.error("Error predicting waste category:", error);
        document.getElementById("resultText").innerText = "Error classifying image.";
    }
}