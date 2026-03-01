import * as crypto from 'crypto';

export class HashChain {
  private static readonly SYSTEM_SALT = 'VIX_SYSTEM_SALT_2024_SECURE';

  static generateInitialHash(inhalerId: string, timestamp: string): string {
    const data = `${inhalerId}${timestamp}${this.SYSTEM_SALT}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static generateNextHash(
    previousHash: string,
    actorId: string,
    timestamp: string,
    eventType: string
  ): string {
    const data = `${previousHash}${actorId}${timestamp}${eventType}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static validateHash(
    currentHash: string,
    previousHash: string,
    actorId: string,
    timestamp: string,
    eventType: string
  ): boolean {
    const expectedHash = this.generateNextHash(previousHash, actorId, timestamp, eventType);
    return crypto.timingSafeEqual(
      Buffer.from(currentHash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  }

  static validateChain(hashChain: Array<{ hash: string; [key: string]: any }>): boolean {
    if (hashChain.length === 0) return true;
    
    // Validate first hash
    const firstEvent = hashChain[0];
    const expectedFirstHash = this.generateInitialHash(
      firstEvent.inhaler_id || 'unknown',
      firstEvent.timestamp
    );
    
    if (firstEvent.hash !== expectedFirstHash) return false;

    // Validate subsequent hashes
    for (let i = 1; i < hashChain.length; i++) {
      const currentEvent = hashChain[i];
      const previousEvent = hashChain[i - 1];
      
      const isValid = this.validateHash(
        currentEvent.hash,
        previousEvent.hash,
        currentEvent.actor_id,
        currentEvent.timestamp,
        currentEvent.event
      );
      
      if (!isValid) return false;
    }

    return true;
  }
}