import { IInhaler, IHashEvent } from '../../server/models/Inhaler';

export interface IOfflineEvent {
  id: string;
  type: 'SCAN' | 'UPDATE' | 'SYNC';
  data: any;
  timestamp: string;
  synced: boolean;
}

export class OfflineStorage {
  private static dbName = 'VIX_OfflineDB';
  private static dbVersion = 1;
  private static db: IDBDatabase | null = null;

  static async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create inhalers store
        if (!db.objectStoreNames.contains('inhalers')) {
          const inhalersStore = db.createObjectStore('inhalers', { keyPath: 'id' });
          inhalersStore.createIndex('status', 'status', { unique: false });
          inhalersStore.createIndex('current_hash', 'current_hash', { unique: false });
        }
        
        // Create offline events store
        if (!db.objectStoreNames.contains('offline_events')) {
          const eventsStore = db.createObjectStore('offline_events', { keyPath: 'id' });
          eventsStore.createIndex('synced', 'synced', { unique: false });
          eventsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Create patient requests store
        if (!db.objectStoreNames.contains('patient_requests')) {
          const requestsStore = db.createObjectStore('patient_requests', { keyPath: 'patient_id' });
          requestsStore.createIndex('urgency_score', 'urgency_score', { unique: false });
        }
      };
    });
  }

  // Inhaler operations
  static async saveInhaler(inhaler: IInhaler): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['inhalers'], 'readwrite');
      const store = transaction.objectStore('inhalers');
      const request = store.put(inhaler);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  static async getInhaler(id: string): Promise<IInhaler | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['inhalers'], 'readonly');
      const store = transaction.objectStore('inhalers');
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  static async getAllInhalers(): Promise<IInhaler[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['inhalers'], 'readonly');
      const store = transaction.objectStore('inhalers');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Offline events operations
  static async saveOfflineEvent(event: IOfflineEvent): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offline_events'], 'readwrite');
      const store = transaction.objectStore('offline_events');
      const request = store.put(event);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  static async getUnsyncedEvents(): Promise<IOfflineEvent[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offline_events'], 'readonly');
      const store = transaction.objectStore('offline_events');
      const index = store.index('synced');
      const request = index.getAll(IDBKeyRange.only(false));
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  static async markEventSynced(eventId: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offline_events'], 'readwrite');
      const store = transaction.objectStore('offline_events');
      const getRequest = store.get(eventId);
      
      getRequest.onsuccess = () => {
        const event = getRequest.result;
        if (event) {
          event.synced = true;
          const putRequest = store.put(event);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Event not found'));
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Patient requests operations
  static async savePatientRequest(request: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['patient_requests'], 'readwrite');
      const store = transaction.objectStore('patient_requests');
      const requestObj = store.put(request);
      
      requestObj.onsuccess = () => resolve();
      requestObj.onerror = () => reject(requestObj.error);
    });
  }

  static async getPatientRequestsByUrgency(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['patient_requests'], 'readonly');
      const store = transaction.objectStore('patient_requests');
      const index = store.index('urgency_score');
      const request = index.getAll();
      
      request.onsuccess = () => {
        // Sort by urgency score descending
        const requests = (request.result || []).sort((a: any, b: any) => 
          b.urgency_score - a.urgency_score
        );
        resolve(requests);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Conflict resolution
  static resolveConflict(localInhaler: IInhaler, serverInhaler: IInhaler): IInhaler {
    // Latest valid hash wins
    const localTimestamp = new Date(localInhaler.updatedAt).getTime();
    const serverTimestamp = new Date(serverInhaler.updatedAt).getTime();
    
    if (localTimestamp > serverTimestamp) {
      return localInhaler;
    } else {
      return serverInhaler;
    }
  }

  // Sync operations
  static async syncWithServer(): Promise<void> {
    const unsyncedEvents = await this.getUnsyncedEvents();
    
    for (const event of unsyncedEvents) {
      try {
        // Send to server
        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event.data)
        });
        
        if (response.ok) {
          await this.markEventSynced(event.id);
        }
      } catch (error) {
        console.error('Sync failed for event:', event.id, error);
        // Exponential backoff would be implemented here
      }
    }
  }
}