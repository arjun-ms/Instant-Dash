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

// System Prompt for Gemini
const SYSTEM_PROMPT = `You are an expert frontend developer specializing in creating beautiful, functional dashboards.

Your task is to generate a complete, single-page HTML dashboard based on the provided JSON data and user instructions.

CRITICAL RULES:
1. Output ONLY valid HTML code - no explanations, no markdown, no code fences like \`\`\`html
2. Include ALL styling within <style> tags in the HTML
3. Use the EXACT data from the JSON - do not hallucinate or make up numbers
4. Create a fully self-contained HTML document (no external dependencies)
5. Make it visually appealing with modern design principles
6. Use inline CSS within the HTML <style> tag
7. Make it responsive and professional-looking
8. If charts are requested, create them using HTML/CSS (no external libraries)
9. Start directly with <!DOCTYPE html> - no preamble or explanation text
10. Do NOT wrap the HTML in code blocks or backticks

The HTML should be production-ready and render perfectly in a browser.`;

// Example Data
const EXAMPLE_DATA = {
    report_title: "Monthly Office Spending",
    currency: "USD",
    expenses: [
        { item: "High-speed Internet", amount: 250 },
        { item: "Coffee & Snacks", amount: 400 },
        { item: "Software Subscriptions", amount: 1200 },
        { item: "Office Electricity", amount: 350 }
    ]
};

const EXAMPLE_PROMPT = "Create a clean business dashboard. Show a total spending summary at the top and a simple table below for the items. Use a professional font and light grey background.";

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