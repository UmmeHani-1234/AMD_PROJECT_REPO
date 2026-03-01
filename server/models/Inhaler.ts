import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IHashEvent {
  hash: string;
  event: 'DONATED' | 'VERIFIED' | 'PICKED_UP' | 'DELIVERED' | 'REJECTED' | 'DISPOSED';
  actor_id: string;
  timestamp: string;
  gps: { lat: number; lng: number } | null;
}

export interface IInhaler extends Document {
  id: string;
  type: string;
  expiry: string;
  quantity: number;
  condition: string;
  reason: string;
  donorName: string;
  donorContact: string;
  donorLocation: string;
  status: 'PENDING' | 'VERIFIED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'REJECTED';
  current_hash: string;
  hash_chain: IHashEvent[];
  createdAt: string;
  updatedAt: string;
}

const HashEventSchema = new Schema({
  hash: { type: String, required: true },
  event: { 
    type: String, 
    required: true,
    enum: ['DONATED', 'VERIFIED', 'PICKED_UP', 'DELIVERED', 'REJECTED', 'DISPOSED']
  },
  actor_id: { type: String, required: true },
  timestamp: { type: String, required: true },
  gps: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false }
  }
}, { _id: false });

const InhalerSchema = new Schema({
  id: { type: String, default: () => `VIX-${Math.floor(10000 + Math.random() * 90000)}`, unique: true },
  type: { type: String, required: true },
  expiry: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  condition: { type: String, required: false },
  reason: { type: String, required: false },
  donorName: { type: String, required: false },
  donorContact: { type: String, required: false },
  donorLocation: { type: String, required: false },
  status: { 
    type: String, 
    default: 'PENDING',
    enum: ['PENDING', 'VERIFIED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REJECTED']
  },
  current_hash: { type: String, required: true },
  hash_chain: [HashEventSchema]
}, {
  timestamps: true
});

export default model<IInhaler>('Inhaler', InhalerSchema);