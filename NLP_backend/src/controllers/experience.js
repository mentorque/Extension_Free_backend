const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { experienceSummary } = require('../utils/prompts.json');
const { gemini_flash } = require('../utils/llms.json');

const SYSTEM_PROMPT = experienceSummary;
const EXPERIENCE_SCHEMA = fs.readFileSync(path.join(__dirname, '../schemas/experience.md'), 'utf8');

function extractJSONFromString(input) {
  const jsonMatch = input.match(/```json\s*([\s\S]*?)\s*```/);

  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (err) {
      throw new Error("Found a JSON block, but it contained invalid JSON.");
    }
  }
  try {
    return JSON.parse(input);
  } catch (err) {
    throw new Error("Could not find a valid JSON object in the model's response.");
  }
}

const generateExperience = async (req, res, next) => {
  try {
    const { jobDescription, experience } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: gemini_flash });

    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: API key is missing.' });
    }

    if (!jobDescription || !experience) {
      return res.status(400).json({ error: 'Missing or invalid jobDescription or experience' });
    }

    const experienceString = JSON.stringify(experience);
    const fullPrompt = `${SYSTEM_PROMPT}\n Job Description:\n${jobDescription}\n Experience:\n${experienceString}\nRespnse Format:${EXPERIENCE_SCHEMA}`;

    const aiResult = await model.generateContent(fullPrompt);
    const response = aiResult.response;
    const text = response.text();
    const extractedResult = extractJSONFromString(text);
    console.log(extractedResult);
    res.json({ result: extractedResult });
  } catch (error) {
    // Pass the error to the centralized error handler
    next(error);
  }
};

module.exports = { generateExperience };