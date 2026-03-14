"use strict";
const fs = require("fs");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is missing. Add it to .env like GEMINI_API_KEY=your_key");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
console.log("API Key loaded successfully");
async function storyToPanels(story) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Convert this story into a comic with 4 panels.\n\nReturn JSON format like:\n[\n { \"panel\":1, \"scene\":\"...\", \"dialogue\":\"...\" },\n { \"panel\":2, \"scene\":\"...\", \"dialogue\":\"...\" }\n]\n\nStory:\n${story}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return parsed;
}
async function generateImage(scene) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Comic book style illustration: ${scene}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}
async function generateComic() {
    const story = `A small robot finds a lost kitten in a futuristic city.\nThe robot searches the city and finally reunites the kitten with its owner.`;
    console.log("Generating comic panels...\n");
    const panels = await storyToPanels(story);
    const comic = [];
    for (const panel of panels) {
        console.log(`Generating image for panel ${panel.panel}...`);
        const imagePrompt = await generateImage(panel.scene);
        comic.push({ ...panel, imagePrompt });
    }
    fs.writeFileSync("comic.json", JSON.stringify(comic, null, 2), "utf8");
    console.log("\nComic generated and saved to comic.json");
}
generateComic().catch((error) => {
    console.error("Comic generation failed:", error);
    process.exit(1);
});
