const { GoogleGenerativeAI } = require("@google/generative-ai");
const { chatAssistant } = require('../utils/prompts.json');
const { gemini_flash } = require('../utils/llms.json');

const SYSTEM_PROMPT = chatAssistant;

const chatWithContext = async (req, res, next) => {
  try {
    const { jobDescription, resume, question } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: API key is missing.' });
    }

    if (!question || !jobDescription || !resume) {
      return res.status(400).json({ error: 'Missing or invalid question, jobDescription or resume' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: gemini_flash });

    const resumeString = typeof resume === 'string' ? resume : JSON.stringify(resume);
    const fullPrompt = `${SYSTEM_PROMPT}\n\nJob Description:\n${jobDescription}\n\nCandidate Resume (JSON):\n${resumeString}\n\nUser Question:\n${question}`;

    const aiResult = await model.generateContent(fullPrompt);
    const response = aiResult.response;
    const text = (response && typeof response.text === 'function') ? response.text() : '';

    let answer = (text || '').trim();

    return res.json({ result: answer });
  } catch (error) {
    next(error);
  }
};

module.exports = { chatWithContext };


