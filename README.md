# The Instant Dashboard

A simple web application that transforms JSON data into beautiful, functional dashboards using AI.

![AI Instant Dashboard Demo](public/assets/office-spending.png)

## 🚀 Features

- **Instant Generation**: Convert JSON data to visual dashboards in seconds
- **Natural Language Control**: Describe what you want in plain English
- **No Dependencies**: Pure vanilla HTML, CSS, and JavaScript
- **Powered by Google Gemini**: Uses Google's latest Gemini models

## 📋 Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

## 🛠️ Installation & Setup

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd instant-dashboard
   ```

2. **Open the application**
   - Simply open `index.html` in your web browser
   - No build process or server required!

3. **Get your API key**
   - Visit [aistudio.google.com](https://aistudio.google.com/app/apikey)
   - Create an account or sign in
   - Generate an API key
   - Paste it into the application

## 📖 How to Use

1. **Enter your Gemini API Key** in the first field
2. **Paste your JSON data** in the JSON Data textarea
3. **Describe your dashboard** in the Dashboard Instructions field
4. Click **"Generate Dashboard"**
5. Watch your dashboard appear in the preview panel!

### Quick Start with Example

Click the **"Load Example Data"** button to populate the form with sample data and see how it works.

## 🧪 Test Case

The application includes a built-in example based on the technical assessment requirements:

**JSON Data:**
```json
{
  "report_title": "Monthly Office Spending",
  "currency": "USD",
  "expenses": [
    {"item": "High-speed Internet", "amount": 250},
    {"item": "Coffee & Snacks", "amount": 400},
    {"item": "Software Subscriptions", "amount": 1200},
    {"item": "Office Electricity", "amount": 350}
  ]
}
```

**Sample Prompt:**
> "Create a clean business dashboard. Show a total spending summary at the top and a simple table below for the items. Use a professional font and light grey background."

## 🏗️ Technical Details

### AI Model Used
- **Model**: Gemini 1.5 Flash (`gemini-1.5-flash`)
- **API**: Google Generative Language API
- **Max Tokens**: 8192

### System Architecture
```
User Input (JSON + Prompt)
         ↓
  Gemini API Call
         ↓
   HTML Generation
         ↓
  Iframe Rendering
```

### File Structure
```
instant-dashboard/
├── public/
│   ├── assets/         # Demo screenshots
│   ├── config/         # System prompt config
│   ├── data/           # Example JSON data
│   ├── index.html      # Main HTML structure
│   ├── style.css       # Styling and layout
│   └── script.js       # Application logic
├── server.js           # Node.js proxy server
├── package.json        # Dependencies
└── README.md           # This file
```

## 🔒 Privacy & Security

- Your API key is stored locally in your browser (localStorage)
- All API calls are made via a local proxy to Google Gemini
- No data is sent to any third-party servers except Google
- The generated dashboards run in a sandboxed iframe

## ⚠️ Error Handling

The application handles:
- ✅ Invalid JSON syntax
- ✅ Missing API key
- ✅ API errors and rate limits
- ✅ Network failures
- ✅ Invalid HTML responses

## 🎨 Features Implemented

- [x] JSON input validation
- [x] Natural language prompt processing
- [x] Real-time dashboard generation
- [x] Error handling and user feedback
- [x] Loading states
- [x] Example data loader
- [x] Responsive design
- [x] Clean, modern UI

## 🚧 Limitations

- Requires an internet connection
- API calls consume Google Gemini API credits (Free tier available)
- Generated dashboards are static (no backend data updates)
- Complex visualizations may require specific prompting

## 💡 Tips for Best Results

1. **Be specific** in your prompts (colors, layout, chart types)
2. **Keep JSON clean** and well-formatted
3. **Test with simple data** first
4. **Iterate on prompts** if the first result isn't perfect

## 📝 License

This project is created for the technical assessment.

## 🤝 Support

If you encounter any issues:
1. Check that your API key is valid
2. Verify your JSON is properly formatted
3. Check browser console for errors
4. Try the example data first

---

**Built with ❤️ using Vanilla JavaScript and Google Gemini**