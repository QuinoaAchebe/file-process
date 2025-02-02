// src/app/api/APIHandler2.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processInvoice(fileContent) {
  const promptText = `You are an expert at analyzing MCB (Member Chargeback) forms. Please extract the following fields from this MCB form content. Look only at the top portion of the first page for these values:

Here's the MCB content:
${fileContent}

Please extract exactly these fields:
1. Invoice Number (figure it out by looking at the pages of the form)
2. Invoice Total (figure it out by looking for Total, or Invoice Total)
3. Invoice Fee (figure it out by looking for something like "Fee" at the bottom; this is often zero)
4. Invoice Date

Calculate this field:
5. Invoice Subtotal (Invoice Total minus Invoice Fee)

Please respond in this exact JSON format:
{
  "invoice_number": "string - just the numbers, no INVOICE # prefix",
  "invoice_total": "number - just the decimal number, no currency symbols",
  "invoice_fee": "number - just the decimal number, no currency symbols",
  "invoice_subtotal": "number - calculated as invoice_total minus invoice_fee",
  "invoice_date": "MM/DD/YY"
}`;

const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: "You are a JSON-generating assistant. Output only valid JSON objects with no additional text." },
    { role: "user", content: promptText }
  ],
  max_tokens: 500,
  temperature: 0  // Remove the response_format line
});
  return response.choices[0].message.content;
}