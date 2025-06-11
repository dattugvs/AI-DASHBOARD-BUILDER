const { loadContext } = require('./contextService');
const { GEMINI_API_KEY, GEMINI_MODEL } = require('../config/gemini');
const axios = require('axios');

async function generateSQLFromPrompt(prompt, mandatoryFields = [], showVisualSuggestions = false) {

  const preparePrompt = (context, userPrompt, fields, showVisualSuggestions) => {
    const basePrompt = `You are a PostgreSQL expert. Use the following schema and rules to generate an SQL query.
    ${context}`; // Context should include all schema, business rules, and the new visualization rules.

    const userPromptText = `User Query: ${userPrompt}`;
    const mandatoryFieldsText = fields.length > 0 ? `Ensure these specific fields are included in the result: ${fields.join(', ')}.` : '';

    let resultFormatInstruction = `Respond strictly in the following format:
SQL:
\`\`\`sql
<generated_sql_query>
\`\`\`

Explanation:
<explanation_of_query>
`;

    if (showVisualSuggestions) {
      resultFormatInstruction += `
Visualization_Suggestions:
\`\`\`json
{
  "table": {
    "suitableColumns": ["columnName1", "columnName2"]
  },
  "barGraph": {
    "xAxis": "columnForXAxis",
    "yAxis": "columnForYAxis",
    "series": "columnForSeriesGrouping"
  },
  "lineGraph": { // Optionally, include other graph types if applicable to the query
    "xAxis": "columnForXAxis",
    "yAxis": "columnForYAxis",
    "series": "columnForSeriesGrouping"
  }
}
\`\`\`
If a graph type is not suitable for the generated query's data, omit its entry from the JSON.`;
    }

    return `${basePrompt}\n\n${mandatoryFieldsText}\n\n${userPromptText}\n\n${resultFormatInstruction}`;
  };

  const context = loadContext();
  const fullPrompt = preparePrompt(context, prompt, mandatoryFields, showVisualSuggestions);
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

  // Assuming 'text' is the full response string from Gemini
const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // --- SQL Extraction ---
  const sqlMatch = text.match(/SQL:\s*```sql\s*([\s\S]+?)\s*```/i);
  const cleanSQL = sqlMatch ? sqlMatch[1].trim() : '';

  // --- Explanation Extraction ---
  const explanationMatch = text.match(/Explanation:\s*([\s\S]+?)\nVisualization_Suggestions:/);
  const explanation = explanationMatch ? explanationMatch[1].trim() : 'No explanation provided.';

  // --- Visualization Suggestions Extraction ---
  const suggestionsMatch = text.match(/Visualization_Suggestions:\s*```json\s*([\s\S]+?)\s*```/i);
  let visualizationSuggestions = null;
  if (suggestionsMatch && suggestionsMatch[1] && showVisualSuggestions) {
      try {
          visualizationSuggestions = JSON.parse(suggestionsMatch[1].trim());
      } catch (e) {
          console.error("Failed to parse Visualization_Suggestions JSON:", e);
      }
  }


  return {
    sql: cleanSQL,
    explanation: explanation || 'No explanation.',
    visualSuggestions: visualizationSuggestions || {
      table: { suitableColumns: [] },
      barGraph: { xAxis: '', yAxis: '', series: '' },
      lineGraph: { xAxis: '', yAxis: '', series: '' }
    }
  };

}

module.exports = { generateSQLFromPrompt };