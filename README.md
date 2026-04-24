# JobFit AI 🚀

JobFit AI is an AI-powered Resume Analyzer designed to help job seekers instantly evaluate their resumes against job descriptions. It uses advanced NLP, text extraction, and GenAI to provide actionable feedback, skill matching, and tailored interview preparation materials.

## Features ✨
- **PDF Resume Extraction**: Parses text securely from uploaded PDF files (includes OCR support via PyMuPDF & Tesseract).
- **Skill Extraction & Semantic Matching**: Automatically extracts skills and matches them semantically using deep learning embeddings (`sentence-transformers`).
- **AI Career Suggestions**: Integrates with Google's Gemini AI to offer customized feedback and actionable resume improvement suggestions.
- **Interview Preparation**: Auto-generates relevant interview questions based on the resume's profile.

## Tech Stack 🛠️

**Backend**
- **Framework**: FastAPI (Python)
- **AI & NLP**: `sentence-transformers`, `google-generativeai` (Gemini)
- **Document Processing**: `PyMuPDF`, `pytesseract`, `Pillow`

**Frontend**
- **Framework**: React.js & Vite
- **Styling**: Tailwind CSS
- **Design System**: Modular, custom functional components.

## Getting Started 💻

### Backend Setup
1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React app:
   ```bash
   npm run dev
   ```
