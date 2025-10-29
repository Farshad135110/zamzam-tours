import { prisma } from '../../src/lib/prisma';

// Interface that matches your frontend expectations
export interface FeedbackRecord {
  feedback_id: string;
  name: string;
  country: string;
  review: string;
  rating: number;
  image?: string;
}

// Helper to convert DB model to frontend format
function dbToRecord(dbRecord: any): FeedbackRecord {
  return {
    feedback_id: dbRecord.feedback_id,
    name: dbRecord.name,
    country: dbRecord.country || '',
    review: dbRecord.review,
    rating: dbRecord.rating || 5,
    image: dbRecord.image || undefined
  };
}

export async function getAllFeedbacks(): Promise<FeedbackRecord[]> {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: {
      feedback_id: 'desc'
    }
  });
  return feedbacks.map(dbToRecord);
}

export async function getFeedbackById(id: string): Promise<FeedbackRecord | null> {
  const feedback = await prisma.feedback.findUnique({
    where: { feedback_id: id }
  });
  return feedback ? dbToRecord(feedback) : null;
}

export async function createFeedback(payload: Omit<FeedbackRecord, 'feedback_id'>): Promise<FeedbackRecord> {
  const created = await prisma.feedback.create({
    data: {
      name: payload.name,
      country: payload.country || null,
      review: payload.review,
      rating: payload.rating || null,
      image: payload.image || null
    }
  });
  
  return dbToRecord(created);
}

export async function updateFeedback(id: string, payload: Partial<FeedbackRecord>): Promise<FeedbackRecord | null> {
  try {
    const updated = await prisma.feedback.update({
      where: { feedback_id: id },
      data: {
        ...(payload.name && { name: payload.name }),
        ...(payload.country !== undefined && { country: payload.country || null }),
        ...(payload.review && { review: payload.review }),
        ...(payload.rating !== undefined && { rating: payload.rating || null }),
        ...(payload.image !== undefined && { image: payload.image || null })
      }
    });
    
    return dbToRecord(updated);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return null; // Record not found
    }
    throw error;
  }
}

export async function deleteFeedback(id: string): Promise<boolean> {
  try {
    await prisma.feedback.delete({
      where: { feedback_id: id }
    });
    return true;
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return false; // Record not found
    }
    throw error;
  }
}
