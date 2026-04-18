const axios = require('axios');

const BASE_URL = 'https://your-app-name.onrender.com';   // ← CHANGE TO YOUR LIVE URL

async function runTests() {
  console.log('🔍 Running Full Status Code Tests for /api/classify\n');
  console.log(`Testing against: ${BASE_URL}\n`);

  const testCases = [
    {
      desc: "1. ✅ Success Case (200)",
      url: `${BASE_URL}/api/classify?name=Chinasa`,
      expectedStatus: 200,
      expectedResponseStatus: "success"
    },
    {
      desc: "2. ✅ Another Success Case",
      url: `${BASE_URL}/api/classify?name=Peter`,
      expectedStatus: 200,
      expectedResponseStatus: "success"
    },
    {
      desc: "3. ❌ 400 Bad Request - Missing name",
      url: `${BASE_URL}/api/classify`,
      expectedStatus: 400,
      expectedResponseStatus: "error"
    },
    {
      desc: "4. ❌ 400 Bad Request - Empty name",
      url: `${BASE_URL}/api/classify?name=`,
      expectedStatus: 400,
      expectedResponseStatus: "error"
    },
    {
      desc: "5. ❌ 400 Bad Request - Only spaces",
      url: `${BASE_URL}/api/classify?name=%20%20`,
      expectedStatus: 400,
      expectedResponseStatus: "error"
    },
    {
      desc: "6. ⚠️  422 Unprocessable Entity (Non-string - hard to trigger in query param)",
      url: `${BASE_URL}/api/classify?name=123`,   // We treat numbers as string, but testing anyway
      expectedStatus: 200,  // Most likely 200, 422 is rare here
      expectedResponseStatus: "success"
    },
    {
      desc: "7. ❌ Error Case - No prediction available (returns 200 with error object)",
      url: `${BASE_URL}/api/classify?name=XyzAbcTestName987654`,
      expectedStatus: 200,
      expectedResponseStatus: "error"
    }
  ];

  for (const test of testCases) {
    try {
      const res = await axios.get(test.url, { timeout: 6000 });

      const statusMatch = res.status === test.expectedStatus;
      const bodyStatusMatch = res.data.status === test.expectedResponseStatus;

      console.log(`${test.desc}`);
      console.log(`   HTTP Status: ${res.status} ${statusMatch ? '✅' : '❌'}`);

      if (res.data.status) {
        console.log(`   Body Status : "${res.data.status}" ${bodyStatusMatch ? '✅' : '❌'}`);
      }

      if (res.data.status === "success") {
        const d = res.data.data;
        console.log(`   Gender: ${d.gender} | Confident: ${d.is_confident} | Time: ${d.processed_at}`);
      } else if (res.data.status === "error") {
        console.log(`   Message: "${res.data.message}"`);
      }

      console.log('─'.repeat(80));
    } catch (err) {
      console.log(`${test.desc} → ❌ Request Failed`);
      console.log(`   ${err.response ? err.response.status + " " + err.response.data.message : err.message}`);
      console.log('─'.repeat(80));
    }
  }

  console.log('\n✅ Testing completed! Check above for any failing tests.');
}

runTests();