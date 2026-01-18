const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: { message: 'Method Not Allowed' } });
    }

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

        res.status(200).json({ text: generatedText });

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: { message: error.message } });
    }
};
