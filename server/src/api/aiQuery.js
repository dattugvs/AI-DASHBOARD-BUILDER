const express = require('express');
const router = express.Router();

const { generateSQLFromPrompt } = require('../services/geminiService');
const { runSQL } = require('../services/sqlService');

router.post('/ai-query', async (req, res) => {
  const { prompt, execute = false } = req.body;

  try {
    const { sql, explanation } = await generateSQLFromPrompt(prompt);

    if (execute) {
      const results = await runSQL(sql);
      return res.json({ sql, explanation, results });
    }

    return res.json({ sql, explanation });
  } catch (err) {
    console.error('[AI-Query Error]', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = router;
