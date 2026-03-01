import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { DonationForm } from "@/components/DonationForm";

interface DonationItem {
  id: string;
  type: string;
  expiry: string;
  quantity: number;
  location: string;
  timestamp: string;
  verified: boolean;
}

export default function Donor() {
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [donationData, setDonationData] = useState<any>(null);

  const handleDonationSuccess = (data: any) => {
    setDonationData(data);
    setSubmitted(true);
    toast.success("Donation registered successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-900">VIX</h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {!submitted ? (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Donate Your Unused Inhaler
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Help save a life and reduce medical waste. Your donation is <strong>anonymous</strong> and will be verified by a local clinic before distribution. 
                  After submission, you'll receive a QR code for tracking your donation.
                </p>
              </div>
                    
              <DonationForm onSuccess={handleDonationSuccess} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 rounded-full p-4">
                    <Heart className="w-12 h-12 text-green-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Thank You for Your Donation!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your donation has been registered successfully and a QR code has been generated.
                </p>
              </div>
                    
              {/* QR Code Display */}
              {donationData?.qrDataUrl && (
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Your QR Code</h3>
                  <div className="bg-white p-4 rounded-lg border inline-block mx-auto">
                    <img 
                      src={donationData.qrDataUrl} 
                      alt="Donation QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      ID: {donationData.inhaler?.id || donationData.id}
                    </p>
                  </div>
                </div>
              )}
                    
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={() => {
                    // Download QR code
                    if (donationData?.qrDataUrl) {
                      const link = document.createElement('a');
                      link.download = `VIX-${donationData.inhaler?.id || 'donation'}-QR.png`;
                      link.href = donationData.qrDataUrl;
                      link.click();
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Download QR Code
                </Button>
                <Button
                  onClick={() => {
                    // Download PDF stickers
                    if (donationData?.pdf) {
                      // Handle both ArrayBuffer and base64 string formats
                      let blob;
                      if (typeof donationData.pdf === 'string') {
                        // If it's a base64 string
                        const binaryString = atob(donationData.pdf);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                          bytes[i] = binaryString.charCodeAt(i);
                        }
                        blob = new Blob([bytes], { type: 'application/pdf' });
                      } else {
                        // If it's already an ArrayBuffer
                        blob = new Blob([donationData.pdf], { type: 'application/pdf' });
                      }
                      
                      const url = URL.createObjectURL(blob);
                      
                      const link = document.createElement('a');
                      link.download = `VIX-${donationData.inhaler?.id || 'donation'}-stickers.pdf`;
                      link.href = url;
                      link.click();
                      
                      URL.revokeObjectURL(url);
                    }
                  }}
                  variant="outline"
                >
                  Download PDF Stickers
                </Button>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  onClick={() => navigate("/")}  
                  variant="outline"
                >
                  Return to Home
                </Button>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Submit Another Donation
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
