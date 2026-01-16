<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# EduGen2 - AI-Powered Educational Content Generator

This application generates interactive educational content in Hebrew using **OpenRouter API** with support for multiple LLM models (Claude, GPT-4, Gemini, etc.).

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your OpenRouter API Key:**
   - Visit [https://openrouter.ai/keys](https://openrouter.ai/keys)
   - Sign up or log in
   - Create a new API key
   - Copy the key (starts with `sk-or-v1-...`)

3. **Configure API Key:**
   - Open `.env.local` file in the project root
   - Replace `your-openrouter-api-key-here` with your actual API key:
     ```
     OPENROUTER_API_KEY=sk-or-v1-YOUR-ACTUAL-KEY-HERE
     ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 🧠 Supported LLM Models

The app is configured to use **Claude 3.5 Sonnet** by default, but you can easily change models in `services/aiService.ts`:

```typescript
const MODELS = {
  CONTENT_GENERATION: "anthropic/claude-3.5-sonnet",
  TREND_DISCOVERY: "anthropic/claude-3.5-sonnet",
  STUDENT_INSIGHTS: "anthropic/claude-3.5-sonnet"
};
```

### Popular OpenRouter Models:

| Provider | Model | Description |
|----------|-------|-------------|
| Anthropic | `anthropic/claude-3.5-sonnet` | Best for complex content (recommended) |
| OpenAI | `openai/gpt-4-turbo` | High quality, fast |
| Google | `google/gemini-pro-1.5` | Good for structured output |
| OpenAI | `openai/gpt-3.5-turbo` | Cheapest option |

See all models: [https://openrouter.ai/models](https://openrouter.ai/models)

## 🪟 Windows 10 Compatibility

✅ Fully compatible with Windows 10!

### Installation on Windows:

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Open PowerShell or CMD in the project folder
3. Run the commands above

### Troubleshooting Windows:

- **Port 3000 in use?** Change `port: 3000` in `vite.config.ts`
- **npm not found?** Restart your terminal after installing Node.js
- **Permission errors?** Run as Administrator

## 📚 Features

- **AI-Powered Syllabus Generation** - Creates 5-chapter courses with Bloom's Taxonomy progression
- **Interactive Content** - Flashcards, quizzes, case studies, analytics
- **Hebrew Language Support** - Full RTL support and native Hebrew content
- **Batch Export** - Download complete courses as ZIP files
- **Student Dashboard** - Progress tracking and AI insights
- **Pedagogical Analysis** - Scaffolding scores, engagement strategies

## 🔧 Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📝 License

MIT
