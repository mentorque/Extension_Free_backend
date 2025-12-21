const { generateContentWithFallback } = require('../utils/geminiClient');
const { chatAssistant } = require('../utils/prompts.json');

const SYSTEM_PROMPT = chatAssistant;

const chatWithContext = async (req, res, next) => {
  try {
    const { jobDescription, resume, question } = req.body || {};

    if (!question || !jobDescription || !resume) {
      return res.status(400).json({ error: 'Missing or invalid question, jobDescription or resume' });
    }

    const resumeString = typeof resume === 'string' ? resume : JSON.stringify(resume);
    const fullPrompt = `${SYSTEM_PROMPT}\n\nJob Description:\n${jobDescription}\n\nCandidate Resume (JSON):\n${resumeString}\n\nUser Question:\n${question}`;

    const response = await generateContentWithFallback(fullPrompt, 'CHAT');
    const text = (response && typeof response.text === 'function') ? response.text() : '';

    let answer = (text || '').trim();

    return res.json({ result: answer });
  } catch (error) {
    next(error);
  }
};

module.exports = { chatWithContext };


