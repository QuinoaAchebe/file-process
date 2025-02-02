// src/app/api/APIHandler.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * processInvoice - Processes the invoice file content using OpenAI.
 * @param {string} fileContent - The text content of the file.
 * @param {string[]} validInvoiceTypes - List of valid invoice types.
 * @returns {Promise<string>} - The result returned from OpenAI.
 */
export async function processInvoice(fileContent, validInvoiceTypes) {
  const promptText = `You are an expert at analyzing invoices and determining their type based on context. Please analyze this invoice content and extract specific fields. Here's the invoice content:

${fileContent}

First, carefully analyze the overall context, language, terminology, items/services listed, payment terms, and document structure. Then, based on your analysis, determine which of these invoice types best matches the content:
${validInvoiceTypes.join(", ")}

Then extract the following fields:
1. Invoice Number
2. Invoice Date
3. Invoice Type (must be one from the list above - explain your reasoning for choosing this type)
4. Brand (the name of the company that this invoice was billed to)
4. Retailer Name (this should be the name of a Retailer or Grocer in the United States. you must find an example of a physical store in the United States that has this name, otherwise it's wrong. this will not be the same as the brand name.)
5. Distributor Name (this should be the name of a provider of CPG distribution services, NOT the name of the product brand that might be on the invoice. You should actually search whether your response matches the name of a company that provides distribution services for CPG products.
 If you can't find that it's definitely true, refer back to the Retailer Name and use that instead.)

Please respond in this exact JSON format:
{
  "invoice_number": "string",
  "invoice_date": "string",
  "invoice_type": "string",
  "invoice_type_reasoning": "string explaining why you chose this type",
  "retailer_name": "string",
  "retailer_reasoning": "string explaining why you chose this as the retailer",
  "distributor_name": "string"
  "distributor_reasoning": "string explaining why you chose this as the distributor"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: promptText }
    ],
    max_tokens: 300,
  });

  return response.choices[0].message.content;
}