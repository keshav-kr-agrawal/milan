import { db, type ContactRequest } from '../data/db';
import { broadcastMilanEvent } from './supabase';

/**
 * Creates an explicit permission request under DPDP Act 2023 Section 6.
 * Broadcasts in real-time to the guardian's device.
 */
export async function createContactRequest(params: {
  memberId: string;
  familyId: string;
  requesterName: string;
  requesterPhone?: string;
  requesterBooth?: string;
}): Promise<ContactRequest> {
  const requestId = 'REQ-' + Math.floor(10000 + Math.random() * 90000);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1-hour active window

  const newRequest: ContactRequest = {
    id: requestId,
    member_id: params.memberId,
    family_id: params.familyId,
    requester_name: params.requesterName.trim() || 'Volunteer / Finder',
    requester_phone: params.requesterPhone?.trim(),
    requester_booth: params.requesterBooth?.trim(),
    status: 'pending',
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
  };

  await db.contact_requests.add(newRequest);

  // Log in DPDP audit trail
  await db.access_log.add({
    id: 'LOG-' + Date.now(),
    actor: `${newRequest.requester_name} (${newRequest.requester_booth || 'Ghat'})`,
    role: 'public',
    action: 'request_consent',
    target: params.memberId,
    reason: `Requested contact unmasking permission under DPDP Act 2023 Section 6`,
    at: now.toISOString(),
  });

  // Broadcast real-time event to guardian
  await broadcastMilanEvent('CONTACT_REQUEST_NEW', newRequest);

  return newRequest;
}

/**
 * Guardian grants or declines contact access.
 * Broadcasts update so requester's screen unlocks instantly.
 */
export async function respondToContactRequest(
  requestId: string,
  decision: 'approved' | 'rejected'
): Promise<void> {
  const req = await db.contact_requests.get(requestId);
  if (!req) return;

  const now = new Date().toISOString();
  await db.contact_requests.update(requestId, {
    status: decision,
    approved_at: decision === 'approved' ? now : undefined,
  });

  // Audit log
  await db.access_log.add({
    id: 'LOG-' + Date.now(),
    actor: 'Family Guardian',
    role: 'public',
    action: decision === 'approved' ? 'grant_consent' : 'request_consent',
    target: req.member_id,
    reason: `Guardian ${decision} contact number access for ${req.requester_name}`,
    at: now,
  });

  const updated = { ...req, status: decision, approved_at: decision === 'approved' ? now : undefined };
  await broadcastMilanEvent('CONTACT_REQUEST_UPDATED', updated);
}

/**
 * Checks if a valid approved grant exists for this member
 */
export async function getApprovedContactRequest(memberId: string): Promise<ContactRequest | null> {
  const now = new Date().toISOString();
  const requests = await db.contact_requests
    .where('member_id')
    .equals(memberId)
    .filter((r) => r.status === 'approved' && r.expires_at > now)
    .toArray();

  return requests.length > 0 ? requests[requests.length - 1] : null;
}
