'use client';

import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { getDocument } from 'pdfjs-dist/webpack';

const FileProcessor = () => {
  const [fileContent, setFileContent] = useState('');
  const [result, setResult] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const pdfjsVersion = '3.11.174';
    window.pdfjsWorkerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;
  }, []);

  // [Previous functions remain unchanged]
  const convertPageToImage = async (page) => {
    try {
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error in convertPageToImage:', error);
      throw error;
    }
  };

  const processPDF = async (file) => {
    try {
      setStatus('Reading PDF file...');
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let extractedText = '';

      setStatus('Initializing Tesseract...');

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setStatus(`Processing page ${pageNum} of ${numPages}...`);
        
        const page = await pdf.getPage(pageNum);
        const imageData = await convertPageToImage(page);
        
        const result = await Tesseract.recognize(
          imageData,
          'eng',
          {
            logger: m => {
              if (m.status === 'recognizing text') {
                const currentProgress = ((pageNum - 1) / numPages * 100) + (m.progress * (100 / numPages));
                setProgress(currentProgress);
              }
            }
          }
        );

        extractedText += `Page ${pageNum}:\n${result.data.text}\n\n`;
        setProgress((pageNum / numPages) * 100);
      }

      return extractedText;
    } catch (error) {
      console.error('Error in processPDF:', error);
      throw error;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setStatus('Starting process...');

    try {
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
      
      const extractedText = await processPDF(file);
      setFileContent(extractedText);

      setStatus('Sending to API...');
      console.log('Sending to API...');
      const response = await fetch('/api/process/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileContent: extractedText }),
      });

      if (response.ok) {
        const data = await response.json();
        try {
          const parsedResult = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          setResult(parsedResult);
        } catch (e) {
          console.error('Error parsing response:', e);
          setResult(data);
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setStatus('');
    }
  };

  return (
    <div className="p-4">
      {/* File Upload Section */}
      <div className="mb-4">
        <input 
          type="file" 
          onChange={handleFileUpload} 
          accept=".pdf"
          className="mb-4" 
        />
      </div>
      
      {isProcessing && (
        <div className="my-4">
          <p>Processing... {progress.toFixed(1)}%</p>
          {status && <p className="text-sm text-gray-600">{status}</p>}
          <div className="w-full bg-gray-200 rounded">
            <div 
              className="bg-blue-600 rounded h-2 transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Content Section */}
      {fileContent && (
        <div className="flex gap-4">
          {/* PDF Viewer */}
          <div className="w-1/2 border rounded-lg overflow-hidden" style={{ height: '800px' }}>
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="PDF Viewer"
            />
          </div>
          
          {/* Results Section */}
          <div className="w-1/2">
            {/* BEGIN NEW MCB ANALYSIS SECTION */}
            {result && Object.keys(result).length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-bold">Invoice Analysis:</h2>
                <div className="mt-2 p-4 bg-gray-100 rounded">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="font-semibold">Invoice Number:</span>
                      <span className="ml-2">{result.invoice_number}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Invoice Date:</span>
                      <span className="ml-2">{result.invoice_date}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Invoice Total:</span>
                      <span className="ml-2">${result.invoice_total}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Invoice Fee:</span>
                      <span className="ml-2">${result.invoice_fee}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Invoice Subtotal:</span>
                      <span className="ml-2">${result.invoice_subtotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* END NEW MCB ANALYSIS SECTION */}

            {/* BEGIN OLD ANALYSIS SECTION - COMMENTED OUT
            <h2 className="text-xl font-bold mt-4">Extracted Text:</h2>
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-60">
              {fileContent}
            </pre>
            
            {result && Object.keys(result).length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-bold">Invoice Analysis:</h2>
                <div className="mt-2 p-4 bg-gray-100 rounded">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="font-semibold">Invoice Number:</span>
                      <span className="ml-2">{result.invoice_number}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Invoice Date:</span>
                      <span className="ml-2">{result.invoice_date}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Invoice Type:</span>
                      <span className="ml-2">{result.invoice_type}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Type Reasoning:</span>
                      <p className="mt-1">{result.invoice_type_reasoning}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Retailer Name:</span>
                      <span className="ml-2">{result.retailer_name}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Distributor Name:</span>
                      <span className="ml-2">{result.distributor_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h2 className="text-xl font-bold">Raw API Response:</h2>
              <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-40">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
            END OLD ANALYSIS SECTION */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileProcessor;