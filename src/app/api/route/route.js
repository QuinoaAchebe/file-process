import { processInvoice } from "../APIHandler2.js";

export async function POST(request) {
  try {
    console.log("Route handler called");
    const { fileContent } = await request.json();
    console.log("File content received:", fileContent.substring(0, 100) + "...");
    
    // Keeping your invoice types array
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
    console.log("Processing complete:", result);

    if (!result) {
      throw new Error("No result returned from processInvoice");
    }

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Detailed error:", error);
    console.error("Error stack:", error.stack);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack,
      details: "Server error occurred"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}