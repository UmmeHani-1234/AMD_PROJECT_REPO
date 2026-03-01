import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, CheckCircle2 } from "lucide-react";

interface DonationFormProps {
  onSuccess: (data: any) => void;
}

interface InhalerData {
  id: string;
  type: string;
  expiry: string;
  status: string;
  current_hash: string;
  qrDataUrl: string;
  pdfData: string;
}

export function DonationForm({ onSuccess }: DonationFormProps) {
  const [formData, setFormData] = useState({
    type: '',
    expiry: '',
    donorName: '',
    donorContact: '',
    donorLocation: '',
    quantity: '1',
    condition: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<InhalerData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.type.trim()) {
      setError('Please select inhaler type');
      return false;
    }
    if (!formData.expiry) {
      setError('Please select expiry date');
      return false;
    }
    if (new Date(formData.expiry) < new Date()) {
      setError('Expiry date cannot be in the past');
      return false;
    }
    if (!formData.donorName.trim()) {
      setError('Please enter donor name');
      return false;
    }
    if (!formData.donorLocation.trim()) {
      setError('Please select donor location');
      return false;
    }
    if (!formData.condition.trim()) {
      setError('Please select inhaler condition');
      return false;
    }
    if (!formData.reason.trim()) {
      setError('Please select donation reason');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit to backend API
      const response = await fetch('/api/inhalers/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          expiry: formData.expiry,
          donorName: formData.donorName,
          donorContact: formData.donorContact,
          donorLocation: formData.donorLocation,
          quantity: parseInt(formData.quantity),
          condition: formData.condition,
          reason: formData.reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit donation');
      }

      const result = await response.json();
      
      if (result.success) {
        setSubmittedData({
          id: result.inhaler.id,
          type: result.inhaler.type,
          expiry: result.inhaler.expiry,
          status: result.inhaler.status,
          current_hash: result.inhaler.current_hash,
          qrDataUrl: result.qrDataUrl,
          pdfData: result.pdf
        });
        
        onSuccess(result);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadQR = () => {
    if (!submittedData?.qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `VIX-${submittedData.id}-QR.png`;
    link.href = submittedData.qrDataUrl;
    link.click();
  };

  const handleDownloadPDF = () => {
    if (!submittedData?.pdfData) return;
    
    const binaryString = atob(submittedData.pdfData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `VIX-${submittedData.id}-stickers.pdf`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFormData({
      type: '',
      expiry: '',
      donorName: '',
      donorContact: '',
      donorLocation: '',
      quantity: '1',
      condition: '',
      reason: ''
    });
    setSubmittedData(null);
    setError(null);
  };

  if (submittedData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">Donation Successful!</CardTitle>
          <CardDescription>
            Your inhaler has been registered in the VIX system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code Display */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-3">Your QR Code</h3>
            <div className="bg-white p-4 rounded-lg border inline-block">
              <img 
                src={submittedData.qrDataUrl} 
                alt="Donation QR Code" 
                className="w-48 h-48 mx-auto"
              />
              <p className="text-sm text-gray-600 mt-2">
                ID: {submittedData.id}
              </p>
            </div>
          </div>

          {/* Donation Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Donation Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">ID:</span> {submittedData.id}</div>
              <div><span className="font-medium">Type:</span> {submittedData.type}</div>
              <div><span className="font-medium">Expiry:</span> {submittedData.expiry}</div>
              <div><span className="font-medium">Status:</span> 
                <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {submittedData.status}
                </span>
              </div>
              <div className="col-span-2"><span className="font-medium">Hash:</span> 
                <span className="font-mono text-xs ml-1 text-gray-600">
                  {submittedData.current_hash.substring(0, 16)}...
                </span>
              </div>
            </div>
          </div>

          {/* Download Options */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleDownloadQR}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
            <Button 
              onClick={handleDownloadPDF}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF Stickers
            </Button>
          </div>

          {/* Next Steps */}
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Next Steps:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Print the PDF stickers for physical labeling</li>
                  <li>Attach QR code sticker to the inhaler packaging</li>
                  <li>Deliver to your nearest VIX clinic hub</li>
                  <li>ASHA workers will scan and verify the donation</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleReset}
            variant="outline" 
            className="w-full"
          >
            Submit Another Donation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle>Donate Unused Inhaler</CardTitle>
        <CardDescription>
          Help reduce medical waste and save lives by donating your unused inhaler
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inhaler Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Inhaler Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select inhaler type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salbutamol">Salbutamol (MDI)</SelectItem>
                  <SelectItem value="budesonide-formoterol">Budesonide/Formoterol (DPI)</SelectItem>
                  <SelectItem value="fluticasone">Fluticasone (MDI)</SelectItem>
                  <SelectItem value="albuterol">Albuterol (MDI)</SelectItem>
                  <SelectItem value="beclomethasone">Beclomethasone (MDI)</SelectItem>
                  <SelectItem value="ipratropium">Ipratropium (MDI)</SelectItem>
                  <SelectItem value="combination">Combination (LABA/LAMA)</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Select value={formData.quantity} onValueChange={(value) => handleSelectChange('quantity', value)}>
                <SelectTrigger id="quantity" className="w-full">
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 inhaler</SelectItem>
                  <SelectItem value="2">2 inhalers</SelectItem>
                  <SelectItem value="3">3 inhalers</SelectItem>
                  <SelectItem value="4">4 inhalers</SelectItem>
                  <SelectItem value="5">5 inhalers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => handleSelectChange('condition', value)}>
                <SelectTrigger id="condition" className="w-full">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unopened">Unopened Package</SelectItem>
                  <SelectItem value="unused">Unused but Opened</SelectItem>
                  <SelectItem value="partially-used">Partially Used</SelectItem>
                  <SelectItem value="expired-soon">Near Expiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reason for Donation */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Donation *</Label>
              <Select value={formData.reason} onValueChange={(value) => handleSelectChange('reason', value)}>
                <SelectTrigger id="reason" className="w-full">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moved">Moved/Relocated</SelectItem>
                  <SelectItem value="alternative">Switched to Alternative Treatment</SelectItem>
                  <SelectItem value="surplus">Received Too Many</SelectItem>
                  <SelectItem value="expired">Near Expiry Date</SelectItem>
                  <SelectItem value="improved">Improved Health</SelectItem>
                  <SelectItem value="prescription-changed">Prescription Changed</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date *</Label>
              <Input
                id="expiry"
                name="expiry"
                type="date"
                value={formData.expiry}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full"
              />
            </div>

            {/* Donor Location */}
            <div className="space-y-2">
              <Label htmlFor="donorLocation">Drop-off Location *</Label>
              <Select value={formData.donorLocation} onValueChange={(value) => handleSelectChange('donorLocation', value)}>
                <SelectTrigger id="donorLocation" className="w-full">
                  <SelectValue placeholder="Select nearest location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinic-1">City Medical Center (411001)</SelectItem>
                  <SelectItem value="clinic-2">General Hospital (411002)</SelectItem>
                  <SelectItem value="clinic-3">District Health Center (411003)</SelectItem>
                  <SelectItem value="clinic-4">Community Health Post (411004)</SelectItem>
                  <SelectItem value="clinic-5">Rural Health Clinic (411005)</SelectItem>
                  <SelectItem value="clinic-6">Private Clinic Network (411006)</SelectItem>
                  <SelectItem value="other">Other Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Donor Name */}
            <div className="space-y-2">
              <Label htmlFor="donorName">Your Name *</Label>
              <Input
                id="donorName"
                name="donorName"
                value={formData.donorName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="w-full"
              />
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label htmlFor="donorContact">Contact (Optional)</Label>
              <Input
                id="donorContact"
                name="donorContact"
                type="tel"
                value={formData.donorContact}
                onChange={handleInputChange}
                placeholder="Phone number or email"
                className="w-full"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Donation...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Submit Donation & Generate QR
                </>
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600 pt-4">
            <p>Your donation will be securely registered in the VIX system</p>
            <p className="mt-1">All information is handled confidentially</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}