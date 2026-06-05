import React from "react";

interface PrintPreviewProps {
  transaction: any;
}

export default function PrintPreview({ transaction }: PrintPreviewProps) {
  // Simple HTML receipt formatting suitable for Thermal Printer 80mm or 58mm
  // We constrain the width to simulate a receipt tape.

  const dateStr = new Date(transaction.createdAt).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div id="print-area" className="w-[300px] bg-white text-black p-4 font-mono text-xs shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-gray-200 mx-auto">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold mb-1">OEMAH ELEKTRONIK</h2>
        <p className="leading-tight">JL TAMAN INDAH V NO 8</p>
        <p className="leading-tight">TAMAN, SEPANJANG SIDOARJO</p>
        <p className="leading-tight">Telp: 08559039000</p>
      </div>

      <div className="border-t border-dashed border-gray-400 my-2"></div>

      {/* Meta info */}
      <div className="mb-2">
        <div className="flex justify-between">
          <span>No :</span>
          <span>{transaction.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Tgl:</span>
          <span>{dateStr}</span>
        </div>
        <div className="flex justify-between">
          <span>Ksr:</span>
          <span>{transaction.cashierName || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>Plg:</span>
          <span>{transaction.customerName || "UMUM"}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-2"></div>

      {/* Items */}
      <div className="mb-2 space-y-2">
        {transaction.cartItems?.map((item: any, idx: number) => (
          <div key={idx}>
            <div className="font-semibold">{item.name}</div>
            <div className="flex justify-between">
              <span>{item.quantity} x {Number(item.price).toLocaleString("id-ID")}</span>
              <span>{(item.quantity * Number(item.price)).toLocaleString("id-ID")}</span>
            </div>
            {Number(item.discount) > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Diskon Item</span>
                <span>-{Number(item.discount * item.quantity).toLocaleString("id-ID")}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-400 my-2"></div>

      {/* Totals */}
      <div className="space-y-1 font-semibold">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{Number(transaction.subtotal).toLocaleString("id-ID")}</span>
        </div>
        {Number(transaction.discount) > 0 && (
          <div className="flex justify-between">
            <span>Diskon Global</span>
            <span>-{Number(transaction.discount).toLocaleString("id-ID")}</span>
          </div>
        )}
        {Number(transaction.tax) > 0 && (
          <div className="flex justify-between">
            <span>Pajak</span>
            <span>{Number(transaction.tax).toLocaleString("id-ID")}</span>
          </div>
        )}
        
        <div className="border-t border-dashed border-gray-400 my-1"></div>
        
        <div className="flex justify-between text-sm font-bold">
          <span>GRAND TOTAL</span>
          <span>{Number(transaction.grandTotal).toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-2"></div>

      {/* Payment */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Tunai</span>
          <span>{Number(transaction.paidAmount).toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between">
          <span>Kembalian</span>
          <span>{Number(transaction.changeAmount).toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-2"></div>

      {/* Footer */}
      <div className="text-center mt-4">
        <p>Terima Kasih</p>
        <p>Barang yang sudah dibeli</p>
        <p>tidak dapat dikembalikan</p>
      </div>

      {/* CSS for print styling specifically inside #print-area */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
          }
        }
      `}} />
    </div>
  );
}
