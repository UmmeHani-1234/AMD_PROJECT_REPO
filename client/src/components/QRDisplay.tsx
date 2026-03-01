import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, QrCode, Printer, Copy, CheckCircle2 } from "lucide-react";

interface QRDisplayProps {
  id: string;
  qrDataUrl: string;
  type: string;
  expiry: string;
  status: string;
  current_hash: string;
  pdfData?: string;
  showActions?: boolean;
  showDetails?: boolean;
}

export function QRDisplay({
  id,
  qrDataUrl,
  type,
  expiry,
  status,
  current_hash,
  pdfData,
  showActions = true,
  showDetails = true
}: QRDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `VIX-${id}-QR.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleDownloadPDF = () => {
    if (!pdfData) return;
    
    const binaryString = atob(pdfData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `VIX-${id}-stickers.pdf`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!qrDataUrl) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print QR Code - ${id}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
              margin: 0;
            }
            .qr-container {
              display: inline-block;
              border: 2px solid #000;
              padding: 20px;
              margin: 20px 0;
            }
            .info {
              margin: 20px 0;
              font-size: 14px;
            }
            .id {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <h1>VIX - Verified Inhaler Exchange</h1>
          <div class="qr-container">
            <img src="${qrDataUrl}" alt="QR Code" style="width: 200px; height: 200px;" />
          </div>
          <div class="info">
            <div class="id">ID: ${id}</div>
            <div>Type: ${type}</div>
            <div>Expiry: ${expiry}</div>
            <div>Status: ${status}</div>
          </div>
          <p>Scan this QR code to verify the inhaler in the VIX system</p>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(current_hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">QR Code Generated</CardTitle>
        <CardDescription>
          Scan or download this QR code for your inhaler
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg border inline-block shadow-sm">
            <img 
              src={qrDataUrl} 
              alt="Inhaler QR Code" 
              className="w-48 h-48 mx-auto"
            />
            <div className="mt-3 text-sm font-mono text-gray-600">
              {id}
            </div>
          </div>
        </div>

        {/* Details Section */}
        {showDetails && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-center">Inhaler Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">ID:</span> {id}</div>
              <div><span className="font-medium">Type:</span> {type}</div>
              <div><span className="font-medium">Expiry:</span> {expiry}</div>
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                  status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {status}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Hash:</span>
                <div className="flex items-center mt-1">
                  <span className="font-mono text-xs text-gray-600 flex-1 truncate">
                    {current_hash.substring(0, 24)}...
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyHash}
                    className="ml-2 h-6 px-2"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleDownloadQR}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
              <Button 
                onClick={handlePrint}
                variant="outline"
                className="w-full"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
            
            {pdfData && (
              <Button 
                onClick={handleDownloadPDF}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF Stickers
              </Button>
            )}
          </div>
        )}

        {/* Instructions */}
        <Alert>
          <AlertDescription className="text-sm">
            <div className="space-y-2">
              <p className="font-medium">Next Steps:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Print and attach the QR code to your inhaler</li>
                <li>Deliver to the nearest VIX clinic hub</li>
                <li>ASHA workers will scan and verify the donation</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}