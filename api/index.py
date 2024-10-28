
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI,File, UploadFile
from fastapi.responses import StreamingResponse
import PyPDF2 
from wordcloud import WordCloud
import io
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('punkt_tab')

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to your frontend origin if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_words_from_pdf(pdf_file):
    text=''
    reader = PyPDF2.PdfReader(pdf_file)
    for page in reader.pages:
        text+=page.extract_text() + ''
    return text

def tokenize_text(text):
    tokens= word_tokenize(text)
    tokens = [word.lower() for word in tokens if word.isalpha()]       
    stop_words = set(stopwords.words('english'))
    filtered_token= [word for word in tokens if word not in stop_words]
    word_Counts = Counter(filtered_token)
    return word_Counts


def create_wordcloud(word_counts):
    wordcloud= WordCloud(width=800, height=400, background_color='white').generate_from_frequencies(word_counts) 
    img = io.BytesIO()
    wordcloud.to_image().save(img, format='PNG')
    img.seek(0)
    return  img




@app.post("/api/py/generate-wordcloud")
async def generate_wordcloud(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        text = extract_words_from_pdf(io.BytesIO(contents))
        word_count = tokenize_text(text)
        img = create_wordcloud(word_count)
        return StreamingResponse(img, media_type='image/png')
    except Exception as e:
        logging.error(f"Error in generate_wordcloud: {str(e)}")
        return {"error": "Internal Server Error"}, 500