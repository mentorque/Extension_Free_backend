const path = require('path');
const fs = require('fs');
const { generateContentWithFallback } = require('../utils/geminiClient');
const { experienceSummary } = require('../utils/prompts.json');

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

    if (!jobDescription || !experience) {
      return res.status(400).json({ error: 'Missing or invalid jobDescription or experience' });
    }

    const experienceString = JSON.stringify(experience);
    const fullPrompt = `${SYSTEM_PROMPT}\n Job Description:\n${jobDescription}\n Experience:\n${experienceString}\nResponse Format:${EXPERIENCE_SCHEMA}`;

    const response = await generateContentWithFallback(fullPrompt, 'EXPERIENCE');
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