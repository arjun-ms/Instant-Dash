import { SYSTEM_PROMPT } from './config/systemPrompt.js';
import { EXAMPLE_DATA, EXAMPLE_PROMPT } from './data/exampleData.js';

// DOM Elements
const apiKeyInput = document.getElementById('apiKey');
const jsonInput = document.getElementById('jsonInput');
const userPromptInput = document.getElementById('userPrompt');
const generateBtn = document.getElementById('generateBtn');
const loadExampleBtn = document.getElementById('loadExampleBtn');
const errorMessage = document.getElementById('errorMessage');
const previewFrame = document.getElementById('previewFrame');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

// Load Example Data
loadExampleBtn.addEventListener('click', () => {
    jsonInput.value = JSON.stringify(EXAMPLE_DATA, null, 2);
    userPromptInput.value = EXAMPLE_PROMPT;
    hideError();
});

// Generate Dashboard
generateBtn.addEventListener('click', async () => {
    hideError();
    
    // Validate inputs
    const apiKey = apiKeyInput.value.trim();
    const jsonData = jsonInput.value.trim();
    const userPrompt = userPromptInput.value.trim();
    
    if (!apiKey) {
        showError('Please enter your Google Gemini API key');
        return;
    }
    
    if (!jsonData) {
        showError('Please enter JSON data');
        return;
    }
    
    if (!userPrompt) {
        showError('Please enter dashboard instructions');
        return;
    }
    
    // Validate JSON
    let parsedJson;
    try {
        parsedJson = JSON.parse(jsonData);
    } catch (e) {
        showError('Invalid JSON format. Please check your JSON syntax.');
        return;
    }
    
    // Start loading
    setLoading(true);
    
    try {
        // Call Gemini API via our proxy server
        const html = await generateDashboard(apiKey, parsedJson, userPrompt);
        
        // Render in iframe
        renderDashboard(html);
        
    } catch (error) {
        showError(`Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
});

// Generate Dashboard using Gemini API (via local proxy server)
async function generateDashboard(apiKey, jsonData, userPrompt) {
    const fullPrompt = `${SYSTEM_PROMPT}

Here is the JSON data:
${JSON.stringify(jsonData, null, 2)}

User Instructions: ${userPrompt}

Generate a complete HTML dashboard using this exact data. Remember: output ONLY the HTML code, nothing else. No code blocks, no explanations.`;

    // Call our local proxy server instead of Gemini directly
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey: apiKey,
            prompt: fullPrompt
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract HTML from response
    let html = data.text;
    
    // Clean up the response (remove markdown code fences if present)
    html = html.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    
    // If the response doesn't start with <!DOCTYPE, try to find it
    if (!html.toLowerCase().startsWith('<!doctype')) {
        const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
        if (doctypeIndex > 0) {
            html = html.substring(doctypeIndex);
        }
    }
    
    return html;
}

// Render Dashboard in iframe
function renderDashboard(html) {
    previewFrame.srcdoc = html;
    previewFrame.classList.add('active');
    previewPlaceholder.classList.add('hidden');
}

// UI Helper Functions
function setLoading(isLoading) {
    generateBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline';
    btnLoader.style.display = isLoading ? 'inline-block' : 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

// Auto-save API key to localStorage (optional convenience feature)
apiKeyInput.addEventListener('change', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
    }
});

// Load saved API key on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
});