import { Router, Request, Response } from 'express';
import Inhaler from '../models/Inhaler';
import { HashChain } from '../utils/hashChain';
import { QRGenerator } from '../utils/qrGenerator';

const router = Router();

// A. DONATION FLOW
router.post('/donate', async (req: Request, res: Response) => {
  try {
    const { type, expiry, donorName, donorContact, donorLocation, quantity, condition, reason } = req.body;
    const timestamp = new Date().toISOString();
    
    // Create initial hash
    const initialHash = HashChain.generateInitialHash(`VIX-${Date.now()}`, timestamp);
    
    // Create inhaler record
    const inhaler = new Inhaler({
      type,
      expiry,
      current_hash: initialHash,
      hash_chain: [{
        hash: initialHash,
        event: 'DONATED',
        actor_id: 'donor_system',
        timestamp,
        gps: null
      }]
    });
    
    await inhaler.save();
    
    // Generate QR code
    const qrDataUrl = await QRGenerator.generateQRContent({
      id: inhaler.id,
      hash: inhaler.current_hash,
      status: inhaler.status,
      expiry: inhaler.expiry
    });
    
    // Generate printable PDF
    const pdfBuffer = await QRGenerator.generateStickerPDF([{
      id: inhaler.id,
      qrDataUrl,
      type: inhaler.type,
      expiry: inhaler.expiry
    }]);
    
    res.status(201).json({
      success: true,
      inhaler: {
        id: inhaler.id,
        type: inhaler.type,
        expiry: inhaler.expiry,
        status: inhaler.status,
        current_hash: inhaler.current_hash
      },
      qrDataUrl,
      pdf: pdfBuffer.toString('base64')
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Donation failed' });
  }
});

// B. CLINIC VERIFICATION FLOW
router.post('/verify/:inhalerId', async (req: Request, res: Response) => {
  try {
    const { inhalerId } = req.params;
    const { clinicId, action, gps } = req.body; // action: 'approve' | 'reject'
    const timestamp = new Date().toISOString();
    
    const inhaler = await Inhaler.findOne({ id: inhalerId });
    if (!inhaler) {
      return res.status(404).json({ success: false, error: 'Inhaler not found' });
    }
    
    // Validate current hash
    const isValid = HashChain.validateChain(inhaler.hash_chain);
    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Hash chain validation failed' });
    }
    
    let newStatus: 'VERIFIED' | 'REJECTED';
    let eventType: 'VERIFIED' | 'REJECTED';
    
    if (action === 'approve') {
      newStatus = 'VERIFIED';
      eventType = 'VERIFIED';
    } else if (action === 'reject') {
      newStatus = 'REJECTED';
      eventType = 'REJECTED';
    } else {
      return res.status(400).json({ success: false, error: 'Invalid action' });
    }
    
    // Generate new hash
    const newHash = HashChain.generateNextHash(
      inhaler.current_hash,
      clinicId,
      timestamp,
      eventType
    );
    
    // Update inhaler
    inhaler.status = newStatus;
    inhaler.current_hash = newHash;
    inhaler.hash_chain.push({
      hash: newHash,
      event: eventType,
      actor_id: clinicId,
      timestamp,
      gps: gps || null
    });
    
    await inhaler.save();
    
    // Generate new QR code
    const qrDataUrl = await QRGenerator.generateQRContent({
      id: inhaler.id,
      hash: inhaler.current_hash,
      status: inhaler.status,
      expiry: inhaler.expiry
    });
    
    res.json({
      success: true,
      inhaler: {
        id: inhaler.id,
        status: inhaler.status,
        current_hash: inhaler.current_hash
      },
      qrDataUrl
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

// C. QR SCAN VALIDATION
router.post('/scan', async (req: Request, res: Response) => {
  try {
    const { qrContent, actorId, eventType, gps } = req.body;
    const timestamp = new Date().toISOString();
    
    // Parse QR content
    const parsedContent = QRGenerator.parseQRContent(qrContent);
    
    // Find inhaler
    const inhaler = await Inhaler.findOne({ id: parsedContent.id });
    if (!inhaler) {
      return res.status(404).json({ success: false, error: 'Inhaler not found' });
    }
    
    // Validate hash matches
    if (inhaler.current_hash !== parsedContent.hash) {
      return res.status(400).json({ 
        success: false, 
        error: 'Hash mismatch - potential tampering detected' 
      });
    }
    
    // Validate hash chain
    const isValid = HashChain.validateChain(inhaler.hash_chain);
    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Hash chain validation failed - tampering detected' 
      });
    }
    
    // Generate new hash for state transition
    const newHash = HashChain.generateNextHash(
      inhaler.current_hash,
      actorId,
      timestamp,
      eventType
    );
    
    // Update inhaler
    inhaler.current_hash = newHash;
    inhaler.hash_chain.push({
      hash: newHash,
      event: eventType as any,
      actor_id: actorId,
      timestamp,
      gps: gps || null
    });
    
    // Update status based on event type
    switch (eventType) {
      case 'PICKED_UP':
        inhaler.status = 'OUT_FOR_DELIVERY';
        break;
      case 'DELIVERED':
        inhaler.status = 'DELIVERED';
        break;
      case 'DISPOSED':
        inhaler.status = 'REJECTED';
        break;
    }
    
    await inhaler.save();
    
    // Generate new QR code
    const newQRDataUrl = await QRGenerator.generateQRContent({
      id: inhaler.id,
      hash: inhaler.current_hash,
      status: inhaler.status,
      expiry: inhaler.expiry
    });
    
    res.json({
      success: true,
      inhaler: {
        id: inhaler.id,
        status: inhaler.status,
        current_hash: inhaler.current_hash,
        hash_chain: inhaler.hash_chain
      },
      qrDataUrl: newQRDataUrl
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Scan validation failed' });
  }
});

// GET INHALER BY ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const inhaler = await Inhaler.findOne({ id: req.params.id });
    if (!inhaler) {
      return res.status(404).json({ success: false, error: 'Inhaler not found' });
    }
    
    res.json({
      success: true,
      inhaler: {
        id: inhaler.id,
        type: inhaler.type,
        expiry: inhaler.expiry,
        status: inhaler.status,
        current_hash: inhaler.current_hash,
        hash_chain: inhaler.hash_chain,
        createdAt: inhaler.createdAt,
        updatedAt: inhaler.updatedAt
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve inhaler' });
  }
});

export default router;