# PDF Word Cloud

A simple web app that turns a **PDF** into a **word cloud** image.

Upload a PDF → extract text → remove stopwords → generate a word cloud PNG.

**Live Demo:** [wordcloud-five.vercel.app](https://wordcloud-five.vercel.app)

---

## Features

- Upload a PDF from the browser
- Extract and tokenize text (NLTK when available, regex fallback)
- Remove English stopwords
- Generate a downloadable-style word cloud image
- Next.js frontend + FastAPI Python backend

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | FastAPI (Python) |
| PDF parsing | PyPDF2 |
| NLP | NLTK (+ fallback tokenizer) |
| Visualization | wordcloud, Pillow |
| Deploy | Vercel (Next.js + Python serverless) |

---

## Project Structure

```
wordcloud/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── pdf-to-wordcloud/        # Upload & generate UI
│   └── components/Uploader.jsx  # PDF upload + API call
├── api/
│   └── index.py                 # FastAPI word-cloud endpoint
├── requirements.txt
├── next.config.js               # Rewrites /api/py → FastAPI
└── vercel.json
```

---

## Setup (Local)

### 1. Clone

```bash
git clone https://github.com/0xfatima/wordcloud.git
cd wordcloud
```

### 2. Install Node dependencies

```bash
npm install
```

### 3. Python environment

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Run both servers

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- FastAPI docs: [http://127.0.0.1:8000/api/py/docs](http://127.0.0.1:8000/api/py/docs)

Open **PDF to Word Cloud** from the site and upload a text-based PDF.

---

## API

**POST** `/api/py/generate-wordcloud/`

- Body: `multipart/form-data` with field `file` (PDF)
- Success: `image/png`
- Errors: JSON `{ "detail": "..." }`

**GET** `/api/py/health` — health check

---

## Production Fixes

These issues were breaking the app on Vercel and are fixed in this repo:

1. **Broken multipart upload** — Frontend was setting `Content-Type: multipart/form-data` manually, which drops the boundary. The browser now sets it automatically.
2. **Wrong production rewrite** — `next.config.js` now maps `/api/py/*` → `/api/` (Python serverless function) in production.
3. **Fragile NLTK on serverless** — NLTK data downloads to `/tmp`, with a regex tokenizer fallback if download fails.
4. **Bad error responses** — API now uses FastAPI `HTTPException` with clear messages.
5. **Missing dependencies** — Added `python-multipart`, `pillow`, `numpy`, `matplotlib` for uploads and wordcloud rendering.
6. **Vercel limits** — `vercel.json` raises function memory/duration; PDFs over ~4MB are rejected with a clear error.

---

## Notes

- Use **text PDFs** (not scanned image-only PDFs) for best results.
- Keep uploads under ~4MB on Vercel free/serverless plans.
- If the live demo shows a different app, reconnect the Vercel project to this GitHub repo and redeploy.
