import { processInvoice } from "./APIHandler2.js";

export async function POST(request) {
  try {
    const { fileContent } = await request.json();
    const validInvoiceTypes = [
      "Ads", "Coupons", "Demo", "Discount", "Disposition", 
      "Distributor Audit", "Distributor Program", "Distributor Spoilage",
      "Early Payment Discount", "Free Fill", "Freight Charges",
      "Invoice Adjustment", "Late Fee", "MCB Promotion",
      "Merchandising", "New Item Setup Fee", "Off-Invoice",
      "Pack Change Fee", "Price Protection", "Promotion",
      "Recall", "Retailer Chargeback", "Retailer Spoilage",
      "Samples", "Scans", "Service Level Fines", "Shortage",
      "Slotting", "Trade Show", "Vendor Return", "Warehouse Cost"
    ];

    const result = await processInvoice(fileContent, validInvoiceTypes);

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}