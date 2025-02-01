'use client';

import React, { useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

const FileProcessor = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setResult(null);
    setError(null);
  };

  const processFile = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Read file content
      const fileContent = await file.text();

      // For now, just show the file content
      // Later we'll add the Claude API integration
      setResult(fileContent.slice(0, 1000) + '...');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        {/* File Upload Section */}
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Any file type supported</p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* File Info */}
        {file && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span>{file.name}</span>
          </div>
        )}

        {/* Process Button */}
        <button
          onClick={processFile}
          disabled={!file || loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
              Processing...
            </>
          ) : (
            'Process File'
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 rounded">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">Result:</h3>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileProcessor;