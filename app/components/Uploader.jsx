"use client";

import Hero from "./HeroSection";
import { useState } from "react";
import Navbar from "./Navbar";

export default function Uploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [wordcloudImage, setWordcloudImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setError("");
    setWordcloudImage(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setSelectedFile(null);
      setError("Please select a PDF file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF first.");
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
        let message = "Error generating word cloud.";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          message = data.detail || data.error || message;
        }
        throw new Error(message);
      }

      if (!contentType.includes("image")) {
        throw new Error("Unexpected response from server. Check that the API is running.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setWordcloudImage(url);
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
          <div className="flex flex-col w-1/3 h-1/2 border-2 border-dashed border-red justify-center items-center align-center rounded-md">
            <label
              htmlFor="file-upload"
              className="mx-auto hover:bg-blue-400 bg-blue-500 w-1/2 p-3 text-center rounded-md cursor-pointer text-white"
            >
              {selectedFile ? "Select another File" : "Select a file"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              className="invisible absolute"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <>
              <p className="mt-4 text-blue-900 font-bold">Uploaded: {selectedFile.name}</p>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="hover:bg-blue-400 bg-blue-500 w-1/4 p-3 text-center rounded-md text-white disabled:opacity-60"
              >
                {loading ? "Generating..." : "Convert"}
              </button>
            </>
          )}

          {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
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
