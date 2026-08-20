from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from PyPDF2 import PdfReader
from wordcloud import WordCloud
from collections import Counter
from pathlib import Path
import io
import os
import re
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Vercel serverless: keep NLTK data in /tmp
NLTK_DATA_DIR = "/tmp/nltk_data"
os.makedirs(NLTK_DATA_DIR, exist_ok=True)
os.environ["NLTK_DATA"] = NLTK_DATA_DIR

ENGLISH_STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "as", "at", "be", "because", "been", "before", "being", "below",
    "between", "both", "but", "by", "can", "did", "do", "does", "doing", "down",
    "during", "each", "few", "for", "from", "further", "had", "has", "have",
    "having", "he", "her", "here", "hers", "herself", "him", "himself", "his",
    "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me",
    "more", "most", "my", "myself", "no", "nor", "not", "now", "of", "off", "on",
    "once", "only", "or", "other", "our", "ours", "ourselves", "out", "over",
    "own", "same", "she", "should", "so", "some", "such", "than", "that", "the",
    "their", "theirs", "them", "themselves", "then", "there", "these", "they",
    "this", "those", "through", "to", "too", "under", "until", "up", "very",
    "was", "we", "were", "what", "when", "where", "which", "while", "who",
    "whom", "why", "will", "with", "you", "your", "yours", "yourself",
    "yourselves", "also", "would", "could", "may", "might", "shall", "must",
}

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def ensure_nltk():
    """Download NLTK data once per cold start when possible."""
    try:
        import nltk

        nltk.data.path.append(NLTK_DATA_DIR)
        for resource in ("punkt", "punkt_tab", "stopwords"):
            try:
                nltk.data.find(
                    f"tokenizers/{resource}" if "punkt" in resource else f"corpora/{resource}"
                )
            except LookupError:
                nltk.download(resource, download_dir=NLTK_DATA_DIR, quiet=True)
        return True
    except Exception as exc:
        logger.warning("NLTK unavailable, using fallback tokenizer: %s", exc)
        return False


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(pdf_bytes))
    parts = []
    for page in reader.pages:
        page_text = page.extract_text() or ""
        parts.append(page_text)
    text = " ".join(parts).strip()
    if not text:
        raise ValueError("No readable text found in this PDF.")
    return text


def tokenize_text(text: str) -> Counter:
    stop_words = set(ENGLISH_STOPWORDS)

    if ensure_nltk():
        try:
            from nltk.corpus import stopwords
            from nltk.tokenize import word_tokenize

            stop_words |= set(stopwords.words("english"))
            tokens = word_tokenize(text)
            tokens = [t.lower() for t in tokens if t.isalpha() and len(t) > 2]
            return Counter(t for t in tokens if t not in stop_words)
        except Exception as exc:
            logger.warning("NLTK tokenize failed, using regex fallback: %s", exc)

    tokens = re.findall(r"[A-Za-z]{3,}", text.lower())
    return Counter(t for t in tokens if t not in stop_words)


def find_font_path():
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return path
    return None


def create_wordcloud(word_counts: Counter) -> io.BytesIO:
    if not word_counts:
        raise ValueError("Not enough words to build a word cloud.")

    kwargs = {
        "width": 800,
        "height": 400,
        "background_color": "white",
        "max_words": 200,
    }
    font_path = find_font_path()
    if font_path:
        kwargs["font_path"] = font_path

    wordcloud = WordCloud(**kwargs).generate_from_frequencies(word_counts)
    img = io.BytesIO()
    wordcloud.to_image().save(img, format="PNG")
    img.seek(0)
    return img


@app.get("/api/py/health")
async def health():
    return {"status": "ok"}


@app.post("/api/py/generate-wordcloud/")
async def generate_wordcloud(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")

    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        # Vercel request body limit is ~4.5MB for serverless functions
        if len(contents) > 4_000_000:
            raise HTTPException(
                status_code=413,
                detail="PDF is too large. Please upload a file under ~4MB.",
            )

        logger.info("Generating word cloud for %s (%s bytes)", file.filename, len(contents))
        text = extract_text_from_pdf(contents)
        word_counts = tokenize_text(text)
        img = create_wordcloud(word_counts)
        return StreamingResponse(img, media_type="image/png")
    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Error generating word cloud")
        raise HTTPException(status_code=500, detail=f"Failed to generate word cloud: {exc}") from exc
