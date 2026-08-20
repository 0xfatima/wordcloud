"use client";

import Hero from "./HeroSection";
import { useMemo, useState } from "react";
import Navbar from "./Navbar";

// Vercel serverless request body limit is ~4.5MB (multipart overhead included)
const MAX_FILE_BYTES = 3.5 * 1024 * 1024;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function validatePdfFile(file) {
  if (!file) {
    return "Please upload a PDF file first.";
  }

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return "Invalid file type. Please upload a PDF (.pdf) only.";
  }

  if (file.size === 0) {
    return "This PDF is empty. Please choose another file.";
  }

  if (file.size > MAX_FILE_BYTES) {
    return `This PDF is ${formatBytes(file.size)}. Max size is ${formatBytes(
      MAX_FILE_BYTES
    )} (Vercel upload limit). Try a smaller or text-only PDF.`;
  }

  return "";
}

export default function Uploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [wordcloudImage, setWordcloudImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("Please upload a PDF file first.");

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
      // Do NOT set Content-Type manually — the browser must add the multipart boundary
      const response = await fetch("/api/py/generate-wordcloud/", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(
            `PDF is too large for the server (limit ~4.5MB). Your file is ${formatBytes(
              selectedFile.size
            )}. Please upload a smaller PDF.`
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
      const url = URL.createObjectURL(blob);
      setWordcloudImage(url);
      setError("");
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(err.message || "Error uploading file.");
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
              {selectedFile ? "Select another file" : "Select a PDF"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf,.pdf"
              className="invisible absolute"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile ? (
            <p className="mt-4 text-blue-900 font-bold">
              Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})
            </p>
          ) : (
            <p className="mt-4 text-blue-900/80">No PDF uploaded yet.</p>
          )}

          <button
            onClick={handleUpload}
            disabled={!canConvert}
            className={`mt-4 w-1/4 p-3 text-center rounded-md text-white ${
              canConvert
                ? "bg-blue-500 hover:bg-blue-400 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed opacity-70"
            }`}
          >
            {loading ? "Generating..." : "Convert"}
          </button>

          {error && (
            <div className="mt-4 max-w-xl rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700 font-semibold text-center">
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
