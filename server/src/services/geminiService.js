const { loadContext } = require('./contextService');
const { GEMINI_API_KEY, GEMINI_MODEL } = require('../config/gemini');
const axios = require('axios');

async function generateSQLFromPrompt(prompt, mandatoryFields = []) {

  const preparePrompt = (context, userPrompt, fields = []) => {
    const basePrompt = `You are a PostgreSQL expert. Use the following schema and rules to generate an SQL query.\n\n${context}`;
    const userPromptText = `User Prompt: ${userPrompt}`;
    const mandatoryFieldsText = mandatoryFields?.length > 0 ? `Make sure to select these fields in the result: ${fields.join(', ')}` : '';
    const resultText = `Respond with:\nSQL: <sql_query>\nExplanation: <why this query>`;
    return `${basePrompt}\n\n${mandatoryFieldsText}\n\n${userPromptText}\n\n${resultText}`;
  }

  const context = loadContext();
  const fullPrompt = preparePrompt(context, prompt, mandatoryFields);
  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + GEMINI_API_KEY,
    {
      contents: [
        {
          parts: [
            { text: fullPrompt }
          ]
        }
      ]
    }
  );

  const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const sqlMatch = text.match(/SQL:\s*([\s\S]+?)\nExplanation:/);
  const explanationMatch = text.match(/Explanation:\s*([\s\S]+)/);

  const rawSQL = sqlMatch ? sqlMatch[1].trim() : '';
  const cleanSQL = rawSQL.replace(/^```sql/i, '').replace(/```$/, '').trim();

  return {
    sql: cleanSQL,
    explanation: explanationMatch ? explanationMatch[1].trim() : 'No explanation.'
  };

}

module.exports = { generateSQLFromPrompt };