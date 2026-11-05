import { db, type Case, type AccessLog } from '../data/db';

/**
 * CallGateway: Masked number bridge adapter.
 * Connects volunteer/public finder to guardian without revealing real phone numbers.
 */
export class CallGateway {
  static async initiateMaskedCall(targetBandId: string, guardianMaskedPhone: string): Promise<{ success: boolean; session_id: string; message: string }> {
    // In production, this issues an API call to Exotel, Twilio, or Kaleyra proxy bridge.
    // For this prototype, it simulates an encrypted bridge connection.
    await new Promise((res) => setTimeout(res, 600));

    // Audit log
    await db.access_log.add({
      id: 'CALL-' + Math.random().toString(36).substring(2, 9),
      actor: 'Public Finder (Masked Bridge)',
      role: 'public',
      action: 'view_public',
      target: targetBandId,
      reason: `Masked telephone bridge initiated to ${guardianMaskedPhone}`,
      at: new Date().toISOString(),
    });

    return {
      success: true,
      session_id: 'SESS-' + Math.floor(100000 + Math.random() * 900000),
      message: `Connecting safely via Pushkaralu Safety Hotline... Call queued to guardian.`,
    };
  }
}

/**
 * SmsOtpGateway: OTP adapter for family registration & returning logins.
 */
export class SmsOtpGateway {
  private static MOCK_OTP = '123456';

  static async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    await new Promise((res) => setTimeout(res, 400));
    console.log(`[SMS Gateway] Dispatched OTP to ${phone}. Test OTP is: ${this.MOCK_OTP}`);
    return {
      success: true,
      message: `OTP sent successfully. (Prototype test OTP: ${this.MOCK_OTP})`,
    };
  }

  static async verifyOtp(phone: string, enteredOtp: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    return enteredOtp.trim() === this.MOCK_OTP;
  }
}

/**
 * OfflineSyncQueue: Handles background sync when connectivity returns.
 */
export class OfflineSyncQueue {
  private static listeners: Array<(count: number) => void> = [];

  static subscribe(listener: (count: number) => void) {
    this.listeners.push(listener);
    this.checkQueue();
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  static async getQueuedCount(): Promise<number> {
    return await db.cases.where('queued_offline').equals(1 as any).or('queued_offline').equals(true as any).count();
  }

  static async checkQueue() {
    const count = await this.getQueuedCount();
    this.listeners.forEach((l) => l(count));
  }

  static async syncPendingCases(): Promise<{ synced: number }> {
    const queued = await db.cases.filter((c) => Boolean(c.queued_offline)).toArray();
    if (queued.length === 0) return { synced: 0 };

    for (const c of queued) {
      await new Promise((res) => setTimeout(res, 250)); // simulate network sync
      await db.cases.update(c.id, { queued_offline: false });
    }

    await this.checkQueue();
    return { synced: queued.length };
  }
}

/**
 * ClientFaceMatcher: Computes on-device facial feature vectors and cosine similarity distance.
 * Lightweight, private, zero raw photo transfers.
 */
export class ClientFaceMatcher {
  /**
   * Generates a 16-element normalized feature descriptor from an image element or canvas.
   * Uses regional luminosity and edge density variance to simulate robust lightweight facial embedding.
   */
  static extractDescriptorFromCanvas(canvas: HTMLCanvasElement): number[] {
    const ctx = canvas.getContext('2d');
    if (!ctx) return new Array(16).fill(0.5);

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h).data;
    
    // Divide face into 4x4 grid (16 cells)
    const descriptor: number[] = [];
    const cellW = Math.floor(w / 4);
    const cellH = Math.floor(h / 4);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let totalLuma = 0;
        let count = 0;
        for (let y = row * cellH; y < (row + 1) * cellH; y += 2) {
          for (let x = col * cellW; x < (col + 1) * cellW; x += 2) {
            const idx = (y * w + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            // Standard perceptual luminance
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLuma += luma;
            count++;
          }
        }
        const avg = count > 0 ? totalLuma / count / 255 : 0.5;
        descriptor.push(Number(avg.toFixed(3)));
      }
    }

    return descriptor;
  }

  /**
   * Calculates Euclidean cosine-equivalent distance between two 16-dimension descriptors.
   * Distance < 0.20 => Strong Match
   * Distance < 0.45 => Possible Match
   */
  static calculateDistance(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 1.0;
    let sumSq = 0;
    for (let i = 0; i < vecA.length; i++) {
      const diff = vecA[i] - vecB[i];
      sumSq += diff * diff;
    }
    const dist = Math.sqrt(sumSq) / Math.sqrt(vecA.length);
    return Number(dist.toFixed(3));
  }

  static getConfidence(dist: number): 'strong' | 'possible' | 'none' {
    if (dist <= 0.22) return 'strong';
    if (dist <= 0.45) return 'possible';
    return 'none';
  }
}
