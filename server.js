const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Serve static files from the public directory using absolute paths
app.use(express.static(path.join(__dirname, 'public')));

// Explicit route for the home page to prevent "Cannot GET /"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Proxy endpoint for Gemini API
app.post('/api/generate', async (req, res) => {
    try {
        const { apiKey, prompt } = req.body;

        if (!apiKey || !prompt) {
            return res.status(400).json({ 
                error: { message: 'API key and prompt are required' } 
            });
        }

        // Gemini API endpoint - using current available model
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API Error:', data);
            return res.status(response.status).json({ 
                error: { message: data.error?.message || 'API request failed' } 
            });
        }

        // Extract the generated text from Gemini response
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            return res.status(500).json({ 
                error: { message: 'No content generated' } 
            });
        }

        res.json({ text: generatedText });

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: { message: error.message } });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Get your free Gemini API key at: https://aistudio.google.com/apikey`);
});