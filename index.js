const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/api/messages', async (req, res) => {
  const userMessage = req.body.text || req.body.activity?.text || "No message";

  try {
    const response = await axios.post(
      'https://sig788task6cdlanguage.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=RetailChatBot&api-version=2021-10-01&deploymentName=production',
      {
        top: 3,
        question: userMessage,
        includeUnstructuredSources: false
      },
      {
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.QNA_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = response.data.answers?.[0]?.answer || "No good answer found.";
    res.json({ type: 'message', text: answer });

  } catch (error) {
    if (error.response) {
      console.error("🔴 Azure QnA API Error Response:");
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      res.status(error.response.status).send(error.response.data);
    } else {
      console.error("🔴 General Error:", error.message);
      res.status(500).send('Internal Server Error');
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`QnA bot listening on port ${port}`));
