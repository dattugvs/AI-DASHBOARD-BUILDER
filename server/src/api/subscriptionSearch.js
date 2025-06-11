const express = require('express');
const router = express.Router();
const { generateSQLFromPrompt } = require('../services/geminiService');
const { runQuery } = require('../services/postgresService');
router.post('/search', async (req, res) => {
    const {
        prompt,
        execute = true,
        mandatoryFields = [],
        showVisualSuggestions = false
    } = req.body;

    try {
        const { sql, explanation, visualSuggestions } = await generateSQLFromPrompt(prompt, mandatoryFields, false);

        if (execute) {
            const { data } = await runQuery(sql);

            res.json({
                sql,
                explanation,
                visualSuggestions,
                content: {
                    total: data.length,
                    results: data,
                },
            });
        } else {
            res.json({
                sql,
                explanation,
                visualSuggestions,
                content: {
                    total: 0,
                    results: [],
                },
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

module.exports = router;
