export interface IPatientRequest {
  patient_id: string;
  age_group: 'UNDER_5' | 'ADULT' | 'OVER_60';
  recent_hospital_visit: boolean;
  location: { lat: number; lng: number };
  urgency_score: number;
  matched_inhaler_id: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IUrgencyFactors {
  age_group: 'UNDER_5' | 'ADULT' | 'OVER_60';
  recent_hospital_visit: boolean;
  distance_km: number;
}

export class UrgencyEngine {
  static calculateScore(factors: IUrgencyFactors): { score: number; explanation: string } {
    let score = 0;
    const explanations: string[] = [];

    // Age group scoring
    if (factors.age_group === 'UNDER_5') {
      score += 30;
      explanations.push('child patient (+30)');
    } else if (factors.age_group === 'OVER_60') {
      score += 20;
      explanations.push('elderly patient (+20)');
    }

    // Hospital visit scoring
    if (factors.recent_hospital_visit) {
      score += 25;
      explanations.push('recent hospital visit (+25)');
    }

    // Distance scoring (1 point per km)
    const distanceScore = Math.floor(factors.distance_km);
    score += distanceScore;
    if (distanceScore > 0) {
      explanations.push(`${distanceScore}km distance (+${distanceScore})`);
    }

    const explanation = explanations.length > 0 
      ? `High urgency: ${explanations.join(', ')}`
      : 'Standard urgency';

    return { score, explanation };
  }

  static sortRequests(requests: IPatientRequest[]): IPatientRequest[] {
    return requests.sort((a, b) => {
      if (b.urgency_score !== a.urgency_score) {
        return b.urgency_score - a.urgency_score;
      }
      // If scores are equal, sort by distance (assuming distance is factored into score)
      return 0;
    });
  }
}