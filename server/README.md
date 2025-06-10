# Node SQL Converter

This project is a Node.js application that converts natural language text into SQL queries using the Gemini API and integrates with the Model Context Protocol (MCP). 

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/node-sql-converter.git
   ```

2. Navigate to the project directory:
   ```
   cd node-sql-converter
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   GEMINI_API_URL=https://api.gemini.com/v1
   ```

## Usage

To start the application, run:
```
npm start
```

The application will be running on `http://localhost:3000`.

## API Endpoints

### Convert Natural Language to SQL

- **Endpoint:** `/api/convert`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "text": "your natural language query here"
  }
  ```
- **Response:**
  ```json
  {
    "sql": "your generated SQL query here"
  }
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.