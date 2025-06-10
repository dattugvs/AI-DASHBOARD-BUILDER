const fs = require('fs');
const path = require('path');

let cachedContext = null;

function loadContext() {
  if (!cachedContext) {
    const contextPath = path.join(__dirname, '../data/mcp_context.txt');
    cachedContext = fs.readFileSync(contextPath, 'utf-8');
  }
  return cachedContext;
}

module.exports = { loadContext };