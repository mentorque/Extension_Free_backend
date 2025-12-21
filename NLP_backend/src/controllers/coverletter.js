const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { coverLetter } = require('../utils/prompts.json');
const { gemini_flash } = require('../utils/llms.json');

const SYSTEM_PROMPT = coverLetter;
const COVERLETTER_SCHEMA = fs.readFileSync(path.join(__dirname, '../schemas/coverletter.md'), 'utf8');

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

const generateCoverLetter = async (req, res, next) => {
  try {
    const { jobDescription, resume } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: gemini_flash });

    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: API key is missing.' });
    }

    if (!jobDescription || !resume) {
      return res.status(400).json({ error: 'Missing or invalid jobDescription or resume' });
    }
    const resumeString = JSON.stringify(resume);
    const fullPrompt = `${SYSTEM_PROMPT}\n Job Description:\n${jobDescription}\n\nresume:\n${resumeString}\n\nResponse Format:${COVERLETTER_SCHEMA}`;

    const aiResult = await model.generateContent(fullPrompt);
    const response = aiResult.response;
    const text = response.text();
    
    console.log('AI Response Text:', text); // Debug log

    const extractedResult = extractJSONFromString(text);
    console.log('Extracted Result:', extractedResult); // Debug log

    res.json({ result: extractedResult });

  } catch (error) {
    // Pass the error to the centralized error handler
    next(error);
  }
};

module.exports = { generateCoverLetter };