"use client";

import Hero from "./HeroSection";
import { useMemo, useState } from "react";
import Navbar from "./Navbar";

const MAX_FILE_BYTES = 3.5 * 1024 * 1024;
// Must use /api/py/... so next.config can rewrite to the Python function on Vercel.
// No trailing slash — avoids FastAPI/Vercel redirect loops.
const GENERATE_URL = "/api/py/generate-wordcloud";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function validatePdfFile(file) {
  if (!file) return "Please upload a PDF file first.";

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) return "Invalid file type. Please upload a PDF (.pdf) only.";
  if (file.size === 0) return "This PDF is empty. Please choose another file.";
  if (file.size > MAX_FILE_BYTES) {
    return `This PDF is ${formatBytes(file.size)}. Max size is ${formatBytes(
      MAX_FILE_BYTES
    )}. Try a smaller text-only PDF.`;
  }

  return "";
}

export default function Uploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [wordcloudImage, setWordcloudImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validationError = useMemo(() => validatePdfFile(selectedFile), [selectedFile]);
  const isValidPdf = Boolean(selectedFile) && !validationError;
  const canConvert = isValidPdf && !loading;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setWordcloudImage(null);

    if (!file) {
      setSelectedFile(null);
      setError("Please upload a PDF file first.");
      return;
    }

    const message = validatePdfFile(file);
    if (message) {
      setSelectedFile(null);
      setError(message);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleUpload = async () => {
    const message = validatePdfFile(selectedFile);
    if (message) {
      setError(message);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    setError("");
    setWordcloudImage(null);

    try {
      const response = await fetch(GENERATE_URL, {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(
            `PDF is too large for the server. Your file is ${formatBytes(
              selectedFile.size
            )}. Please upload a file under ${formatBytes(MAX_FILE_BYTES)}.`
          );
        }

        let detail = `Error generating word cloud (HTTP ${response.status}).`;
        if (contentType.includes("application/json")) {
          const data = await response.json();
          detail = data.detail || data.error || detail;
          if (Array.isArray(detail)) {
            detail = detail.map((m) => m.msg || JSON.stringify(m)).join(", ");
          }
        }
        throw new Error(detail);
      }

      if (!contentType.includes("image")) {
        throw new Error("Unexpected response from server. Check that the API is running.");
      }

      const blob = await response.blob();
      setWordcloudImage(URL.createObjectURL(blob));
      setError("");
    } catch (err) {
      console.error("Error uploading file:", err);
      if (err?.message === "Failed to fetch") {
        setError(
          "Could not reach the word cloud API (network/redirect error). Please try again after redeploy, or use a smaller PDF."
        );
      } else {
        setError(err.message || "Error uploading file.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="pb-10 Hero">
        <Navbar />
        <Hero>
          <h2 className="text-4xl font-bold mb-4">Upload a PDF</h2>
          <p className="mb-4 text-sm text-blue-900">
            Text-based PDFs only. Max size: {formatBytes(MAX_FILE_BYTES)}.
          </p>

          <div className="flex flex-col w-1/3 min-h-[120px] border-2 border-dashed border-blue-300 justify-center items-center rounded-md p-4 bg-white/40">
            <label
              htmlFor="file-upload"
              className="mx-auto hover:bg-blue-400 bg-blue-500 w-1/2 p-3 text-center rounded-md cursor-pointer text-white"
            >
              Select a PDF
            </label>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf,.pdf"
              className="invisible absolute"
              onChange={handleFileChange}
            />
          </div>

          {/* Convert: grey + disabled until a valid PDF is uploaded; red when ready */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={!canConvert}
            className={`mt-4 w-1/4 p-3 text-center rounded-md text-white font-semibold transition ${
              canConvert
                ? "bg-red-600 hover:bg-red-500 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Generating..." : "Convert"}
          </button>

          {/* Re-upload + size under Convert — always clickable to pick another file */}
          <label
            htmlFor="file-upload"
            className="mt-2 text-sm text-blue-900 underline cursor-pointer hover:text-blue-700"
          >
            {selectedFile
              ? `Re-upload file — ${selectedFile.name} (${formatBytes(selectedFile.size)})`
              : "No PDF uploaded yet — click to choose a file"}
          </label>

          {error && (
            <div className="mt-4 max-w-xl rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700 font-medium text-center">
              {error}
            </div>
          )}
        </Hero>

        {wordcloudImage && (
          <div className="flex flex-col mt-4 justify-center items-center">
            <h3 className="text-xl font-bold">Generated Word Cloud:</h3>
            <img
              src={wordcloudImage}
              alt="Generated Word Cloud"
              className="mt-2 border rounded max-w-full"
            />
          </div>
        )}
      </section>
    </>
  );
}
