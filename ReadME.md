# Stage 0 - Backend API Integration Assessment

## Endpoint
**GET** `/api/classify?name={name}`

## Live URL


## Features Implemented
- Proper input validation (400 for missing/empty name)
- Integration with Genderize.io API
- Data processing (renamed `count` to `sample_size`, added `is_confident`, `processed_at`)
- Correct confidence logic (`probability >= 0.7 && sample_size >= 100`)
- Proper error handling and response formats
- CORS enabled (`Access-Control-Allow-Origin: *`)

## Tech Stack
- Node.js + Express
- Axios for API calls

## How to Test
Example: