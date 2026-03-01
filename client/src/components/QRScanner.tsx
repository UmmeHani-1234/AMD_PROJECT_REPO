import { useState, useRef } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { HashChain } from '../../server/utils/hashChain';
import { OfflineStorage } from '../utils/offlineStorage';

interface QRScannerProps {
  onScanSuccess: (data: any) => void;
  onScanError: (error: string) => void;
  actorId: string;
  role: 'CLINIC' | 'ASHA' | 'RECYCLING';
}

export function QRScanner({ onScanSuccess, onScanError, actorId, role }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Handle online/offline status
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);
  
  useRef(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  const handleScan = async (result: string) => {
    try {
      setScanning(true);
      
      // Parse QR content
      const qrData = JSON.parse(result);
      
      // Validate required fields
      if (!qrData.id || !qrData.hash || !qrData.status || !qrData.expiry) {
        throw new Error('Invalid QR code format');
      }
      
      setScanResult(result);
      
      // Check if we have the inhaler in local storage
      let localInhaler = await OfflineStorage.getInhaler(qrData.id);
      
      if (!localInhaler && isOnline) {
        // Fetch from server
        const response = await fetch(`/api/inhalers/${qrData.id}`);
        if (response.ok) {
          const data = await response.json();
          localInhaler = data.inhaler;
          await OfflineStorage.saveInhaler(localInhaler);
        }
      }
      
      if (!localInhaler) {
        throw new Error('Inhaler not found in local storage');
      }
      
      // Validate hash chain
      const isValid = HashChain.validateChain(localInhaler.hash_chain);
      if (!isValid) {
        throw new Error('Hash chain validation failed - potential tampering');
      }
      
      // Check hash matches
      if (localInhaler.current_hash !== qrData.hash) {
        throw new Error('Hash mismatch - inhaler may have been modified');
      }
      
      // Determine allowed actions based on role
      const allowedActions = getAllowedActions(role, localInhaler.status);
      
      const scanData = {
        inhaler: localInhaler,
        qrData,
        allowedActions,
        isOnline,
        timestamp: new Date().toISOString()
      };
      
      // Save offline event if we're offline
      if (!isOnline) {
        await OfflineStorage.saveOfflineEvent({
          id: `scan_${Date.now()}`,
          type: 'SCAN',
          data: { qrData, actorId, role },
          timestamp: new Date().toISOString(),
          synced: false
        });
      }
      
      onScanSuccess(scanData);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Scan failed';
      onScanError(errorMessage);
      
      // Save failed scan attempt for retry
      if (!isOnline) {
        await OfflineStorage.saveOfflineEvent({
          id: `failed_scan_${Date.now()}`,
          type: 'SCAN',
          data: { error: errorMessage, qrContent: result, actorId, role },
          timestamp: new Date().toISOString(),
          synced: false
        });
      }
    } finally {
      setScanning(false);
    }
  };

  const getAllowedActions = (role: string, status: string) => {
    const actions: string[] = [];
    
    switch (role) {
      case 'CLINIC':
        if (status === 'PENDING') actions.push('VERIFY', 'REJECT');
        break;
      case 'ASHA':
        if (status === 'VERIFIED') actions.push('PICK_UP');
        if (status === 'OUT_FOR_DELIVERY') actions.push('DELIVER');
        break;
      case 'RECYCLING':
        if (status === 'REJECTED') actions.push('DISPOSE');
        break;
    }
    
    return actions;
  };

  const handleError = (error: any) => {
    console.error('QR Scanner Error:', error);
    onScanError('Camera access denied or scanning failed');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Scan Inhaler QR Code
        </h3>
        
        {!scanning && !scanResult && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <QrScanner
              onDecode={handleScan}
              onError={handleError}
              constraints={{ facingMode: 'environment' }}
              className="w-full h-64"
            />
            <p className="text-gray-600 mt-4">
              Position the QR code within the frame
            </p>
          </div>
        )}
        
        {scanning && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing scan...</p>
          </div>
        )}
        
        {scanResult && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-green-600 font-medium">Scan successful!</p>
          </div>
        )}
        
        <div className="mt-6 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
              {isOnline ? 'Online' : 'Offline Mode'}
            </span>
          </div>
          <button 
            onClick={() => {
              setScanResult(null);
              setScanning(false);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Scan Again
          </button>
        </div>
      </div>
    </div>
  );
}