# 🚀 BizForge: GenAI-Powered Branding Suite

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**BizForge** is an intelligent, end-to-end branding automation platform that empowers startups, creators, and small businesses to build complete brand identities using Generative AI. 

Built with a high-performance **FastAPI** backend and an ultra-modern, monolithic **Tailwind CSS** frontend, the platform provides a single interface for all branding tasks—transforming hours of manual design and copywriting work into minutes.

---

## ✨ Key Features

- **Brand Name Generation**: Instantly generate catchy, industry-specific brand names.
- **AI Logo Studio**: Generate vector-style, flat-design logos using structured prompting (Powered by Stable Diffusion XL / FLUX.1).
- **Copywriting Automation**: Draft product descriptions, social media content, and professional emails.
- **Tagline & Slogan Creator**: Generate highly converting marketing slogans.
- **Sentiment Analysis & Rewrite**: Analyze the sentiment of text and rewrite it for a better tone.
- **Long-Text Summarization**: Condense long articles or documents into actionable bullet points.
- **AI Branding Chatbot**: Conversational branding guidance powered by Hugging Face (IBM Granite).

---

## 🏗️ Architecture & Tech Stack

### Backend
* **Framework:** FastAPI (Python)
* **Server:** Uvicorn
* **Data Validation:** Pydantic
* **AI Integrations:** * Text/Chat: **Groq Cloud** (LLaMA-3.3-70B-Versatile) & **Hugging Face** (IBM Granite)
  * Visuals/Logos: **SDXL / FLUX.1** ### Frontend
* **Core:** HTML5, vanilla JavaScript (Fetch API)
* **Styling:** Tailwind CSS (via CDN)
* **UI/UX Design:** Dark-mode, monochromatic SaaS aesthetic inspired by Vercel/Framer.

---

⚙️ Prerequisites
Before you begin, ensure you have the following installed on your machine:
Python 3.10+
Git
API Keys for Groq and Hugging Face (or your chosen image generation provider).

🚀 Setup & Installation
1. Clone the Repository
2. Set Up the Backend
Navigate to the backend folder and create a virtual environment to install dependencies:

# Install required packages
pip install -r requirements.txt
3. Environment Variables
Create a .env file in your backend directory and add your API keys:

Ini, TOML
GROQ_API_KEY=your_groq_api_key_here

HUGGINGFACE_API_KEY=your_huggingface_api_key_here

FLUX_API_KEY=your_flux_or_fal_api_key_here  # Optional for Logo generation upgrade

4. Run the Backend Server
Start the FastAPI application using Uvicorn:


5. Run the Frontend
Because the frontend uses vanilla HTML/JS and Tailwind via CDN, you don't need a complex Node.js build process.
Simply open frontend/index.html in your web browser, or use a tool like Live Server in VS Code to run it on a local port.

🗺️ Future Roadmap
[ ] Complete migration from SDXL to FLUX.1 for flawless typography in AI logos.

[ ] Implement PostgreSQL database to save user branding projects.

[ ] Add JWT Authentication for user sign-ups and login.

[ ] Introduce direct "Download as SVG/PNG" options for generated brand assets.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
