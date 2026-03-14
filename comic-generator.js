const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Convert story to comic panels
async function storyToPanels(story) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `
Convert this story into a comic with 4 panels.

Return JSON format like:
[
 { "panel":1, "scene":"...", "dialogue":"..." },
 { "panel":2, "scene":"...", "dialogue":"..." }
]

Story:
${story}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
}

// Generate image prompt for each panel
async function generateImage(scene) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `Comic book style illustration: ${scene}`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

async function generateComic() {
  const story = `
A small robot finds a lost kitten in a futuristic city.
The robot searches the city and finally reunites the kitten with its owner.
`;

  console.log("Generating comic panels...\n");

  const panels = await storyToPanels(story);

  const comic = [];

  for (const panel of panels) {
    console.log(`Generating image for panel ${panel.panel}...`);

    const imagePrompt = await generateImage(panel.scene);

    comic.push({
      panel: panel.panel,
      scene: panel.scene,
      dialogue: panel.dialogue,
      imagePrompt: imagePrompt,
    });
  }

  fs.writeFileSync("comic.json", JSON.stringify(comic, null, 2));

  console.log("\nComic generated and saved to comic.json");
}

generateComic();
