const express = require('express');
const dotenv = require('dotenv');
const Together = require('together-ai');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Together AI client
const together = new Together({
  auth: process.env.TOGETHER_API_KEY,
});

// Therapist system prompt
const therapistPrompt = `
You are a compassionate and empathetic therapist. Your role is to listen actively, provide supportive and non-judgmental responses, and offer gentle guidance to help the user explore their feelings and thoughts. Use a calm and caring tone, ask open-ended questions to encourage reflection, and validate the user's emotions. Avoid giving direct advice unless explicitly asked, and focus on creating a safe space for the user to express themselves.
`;

// Chat API route
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    // console.log("🚀 ~ app.post ~ message:", message)

    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Call Together AI chat completion
    const response = await together.chat.completions.create({
    //   model: 'mistral-7b-instruct-v0.2',
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
      messages: [
        { role: 'system', content: therapistPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    // Extract the assistant's response
    const therapistResponse = response.choices[0].message.content;

    // Send response
    res.status(200).json({ response: therapistResponse });
    // res.status(200).json({ response: "Hii" });
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});