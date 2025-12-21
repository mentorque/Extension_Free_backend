const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { resumeParser } = require('../utils/prompts.json');
const { gemini_flash } = require('../utils/llms.json');

const SYSTEM_PROMPT = resumeParser;
const EXPERIENCE_SCHEMA = fs.readFileSync(path.join(__dirname, '../schemas/experience.md'), 'utf8');
const RESUME_SCHEMA = fs.readFileSync(path.join(__dirname, '../schemas/resume.md'), 'utf8');

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

const uploadResume = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const resumeText = req.body;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: gemini_flash });

    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: API key is missing.' });
    }

    if (!resumeText || typeof resumeText !== 'string') {
      return res.status(400).json({ error: 'Resume text is required and must be a string' });
    }

    const fullPrompt = `${SYSTEM_PROMPT}\n Candidate resume: ${resumeText}\n Experience Schema: ${EXPERIENCE_SCHEMA} and arrange all information in this format Resume Schema: ${RESUME_SCHEMA}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    const extractedResult = extractJSONFromString(text);

    res.json({ result: extractedResult });

  } catch (error) {
    // Pass the error to the centralized error handler
    next(error);
  }
};

module.exports = { uploadResume };