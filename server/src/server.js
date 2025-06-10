const app = require('./app');
const dotenv = require('dotenv');
const { bootstrapCsvFolder } = require('./services/bootstrapCsvToPostgres');
dotenv.config();

const port = process.env.PORT || 3000;
const handleAppStart = async () => {
  bootstrapCsvFolder()
  .then(() => {
    console.log('✅ CSV import complete');
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch(err => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });
};

handleAppStart();