# AI Story to Comic Generator

A simple Node.js demo that converts a short story into comic panels using Gemini generative AI and saves the result to comic.json.

## What it does
1. Converts a story into 4 comic panels (scene + dialogue) using Gemini text generation.
2. Creates an image prompt for each panel in comic book style.
3. Writes generated results to comic.json.

## Prerequisites
- Node.js 18+ installed
- A Gemini API key from Google Cloud

## Setup
1. Clone the repo and install dependencies:

```sh
npm install
```

2. Add your API key to .env:

```sh
echo "GEMINI_API_KEY=YOUR_API_KEY" > .env
```

3. (Optional) Update story in comic-generator.js.

## Run

```sh
npm start
```

You should see logs and a generated comic.json file.

## Output
The output is JSON with panels like:

`json
[
  {"panel":1,"scene":"...","dialogue":"...","imagePrompt":"..."},
  ...
]
`

## Notes
- This demo uses gemini-1.5-flash in the current code.
- For better results, you can refine prompts in storyToPanels and generateImage.

## Troubleshooting
- If you see authentication errors, verify GEMINI_API_KEY in .env.
- If JSON parsing fails, inspect output text from model.generateContent() in the script.
