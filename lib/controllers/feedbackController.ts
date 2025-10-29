import {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  FeedbackRecord
} from '../models/feedbackModel';

export async function listFeedbacks(): Promise<FeedbackRecord[]> {
  return getAllFeedbacks();
}

export async function getFeedback(id: string): Promise<FeedbackRecord | null> {
  return getFeedbackById(id);
}

export async function addFeedback(payload: Omit<FeedbackRecord, 'feedback_id'>): Promise<FeedbackRecord> {
  // Basic validation
  if (!payload.name || !payload.review) {
    throw new Error('name and review are required');
  }
  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new Error('rating must be between 1 and 5');
  }
  return createFeedback(payload);
}

export async function editFeedback(id: string, payload: Partial<FeedbackRecord>): Promise<FeedbackRecord | null> {
  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new Error('rating must be between 1 and 5');
  }
  return updateFeedback(id, payload);
}

export async function removeFeedback(id: string): Promise<boolean> {
  return deleteFeedback(id);
}
