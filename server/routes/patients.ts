import { Router, Request, Response } from 'express';
import { IPatientRequest, IUrgencyFactors, UrgencyEngine } from '../models/PatientRequest';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// In-memory storage for patient requests (in production, use MongoDB)
let patientRequests: IPatientRequest[] = [];

// C. PATIENT MATCHING (AI COMPONENT)
router.post('/request', async (req: Request, res: Response) => {
  try {
    const { age_group, recent_hospital_visit, location, clinic_location } = req.body;
    
    // Calculate distance
    const distanceKm = calculateDistance(
      location.lat, location.lng,
      clinic_location.lat, clinic_location.lng
    );
    
    // Calculate urgency score
    const factors: IUrgencyFactors = {
      age_group,
      recent_hospital_visit,
      distance_km: distanceKm
    };
    
    const { score, explanation } = UrgencyEngine.calculateScore(factors);
    
    // Create patient request
    const patientRequest: IPatientRequest = {
      patient_id: `P-${Math.floor(10000 + Math.random() * 90000)}`,
      age_group,
      recent_hospital_visit,
      location,
      urgency_score: score,
      matched_inhaler_id: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    patientRequests.push(patientRequest);
    
    // Sort all requests by urgency
    const sortedRequests = UrgencyEngine.sortRequests([...patientRequests]);
    
    res.status(201).json({
      success: true,
      patient_request: patientRequest,
      urgency_explanation: explanation,
      queue_position: sortedRequests.findIndex(req => req.patient_id === patientRequest.patient_id) + 1,
      total_requests: sortedRequests.length
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Request processing failed' });
  }
});

// GET ALL PATIENT REQUESTS (SORTED BY URGENCY)
router.get('/queue', async (req: Request, res: Response) => {
  try {
    const sortedRequests = UrgencyEngine.sortRequests([...patientRequests]);
    
    res.json({
      success: true,
      requests: sortedRequests,
      total_count: sortedRequests.length
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve queue' });
  }
});

// MATCH PATIENT WITH INHALER
router.post('/match/:patientId/:inhalerId', async (req: Request, res: Response) => {
  try {
    const { patientId, inhalerId } = req.params;
    
    const patientRequest = patientRequests.find(req => req.patient_id === patientId);
    if (!patientRequest) {
      return res.status(404).json({ success: false, error: 'Patient request not found' });
    }
    
    if (patientRequest.matched_inhaler_id) {
      return res.status(400).json({ success: false, error: 'Patient already matched' });
    }
    
    // Update patient request with matched inhaler
    patientRequest.matched_inhaler_id = inhalerId;
    patientRequest.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      match: {
        patient_id: patientRequest.patient_id,
        inhaler_id: inhalerId,
        urgency_score: patientRequest.urgency_score
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Matching failed' });
  }
});

// Helper function to calculate distance between two GPS coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

export default router;