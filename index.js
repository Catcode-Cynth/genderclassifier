const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));

app.get('/api/classify', async (req, res) => {
  const name = req.query.name;

  // 400 - Missing or empty name
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      status: "error",
      message: "Name parameter is required and must be a non-empty string"
    });
  }

  // 422 - Non-string name (rare in query params, but we check explicitly)
  if (typeof name !== 'string') {
    return res.status(422).json({
      status: "error",
      message: "Name must be a string"
    });
  }

  try {
    const apiUrl = `https://api.genderize.io?name=${encodeURIComponent(name.trim())}`;
    const response = await axios.get(apiUrl, { timeout: 4000 });

    const data = response.data;

    // Edge case: No prediction available
    if (!data.gender || data.count === 0) {
      return res.status(200).json({
        status: "error",
        message: "No prediction available for the provided name"
      });
    }

    // Success response
    const processed = {
      name: data.name,
      gender: data.gender,
      probability: parseFloat(data.probability),
      sample_size: data.count,
      is_confident: data.probability >= 0.7 && data.count >= 100,
      processed_at: new Date().toISOString()
    };

    res.status(200).json({
      status: "success",
      data: processed
    });

  } catch (error) {
    console.error('API Error:', error.message);

    if (error.response) {
      // External API failed
      return res.status(502).json({
        status: "error",
        message: "Failed to fetch prediction from external service"
      });
    }

    // Server error
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});