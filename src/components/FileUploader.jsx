import { useState } from "react";

const FileUploader = ({ onFileSelect }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");

  // Handle file selection (click or drop)
  const handleFile = (file) => {
    setError("");
    setUploadedFile(null);

    if (!file) return;

    // Check file type
    if (file.type !== "application/pdf") {
      setError("Error: Only PDF files are allowed.");
      return;
    }

    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError("Error: File size exceeds 20MB limit.");
      return;
    }

    setUploadedFile(file);
    onFileSelect?.(file);
  };

  // Input file change
  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  // Drag-and-drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="w-full gradient-border p-2 cursor-pointer text-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => !uploadedFile && document.getElementById("fileInput").click()}
    >
      <input
        id="fileInput"
        type="file"
        accept=".pdf"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {uploadedFile ? (
        <div className="uploader-selected-file">
            <div className="flex justify-between items-center w-full">
                <img src="/images/pdf.png" alt="pdf" className="size-10" />
                <div>
                    <p className="text-md font-medium text-gray-700 truncate max-w-xs">{uploadedFile.name}</p>
                    <p className="text-sm font-medium text-gray-700">
                        {uploadedFile.size < 1024 * 1024
                        ? `${(uploadedFile.size / 1024).toFixed(2)} KB`
                        : `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`}
                    </p>
                </div>
                <button className="p-2 cursor-pointer" onClick={() => setUploadedFile(null)}>
                    <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                </button>
            </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl">
            <div className="mx-auto w-16 h-16 flex items-center justify-center">
                <img src="/icons/info.svg" alt="upload" />
            </div>
            <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-lg text-gray-400">PDF (max 20 MB)</p>
        </div>
      )}

      {error && <p className="text-red-500 font-medium mt-2">{error}</p>}
    </div>
  );
};

export default FileUploader;
