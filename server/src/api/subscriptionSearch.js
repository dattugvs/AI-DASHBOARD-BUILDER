const express = require('express');
const router = express.Router();
const { generateSQLFromPrompt } = require('../services/geminiService');
const { runQuery } = require('../services/postgresService');
router.post('/search', async (req, res) => {
    const {
        prompt,
        execute = true,
        mandatoryFields = [],
        pageNumber = 1,
        pageSize = 50,
    } = req.body;

    try {
        const { sql, explanation } = await generateSQLFromPrompt(prompt, mandatoryFields);

        if (execute) {
            const { data, total } = await runQuery(sql);

            res.json({
                sql,
                explanation,
                content: {
                    total: total ? total : data.length,
                    pageNumber,
                    pageSize,
                    results: data,
                },
            });
        } else {
            res.json({
                sql,
                explanation,
                content: {},
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

module.exports = router;
