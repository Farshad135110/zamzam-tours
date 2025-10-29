import { NextApiRequest, NextApiResponse } from 'next';
import { getFeedback, editFeedback, removeFeedback } from '../../../lib/controllers/feedbackController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid feedback ID' });
  }

  if (req.method === 'GET') {
    try {
      const feedback = await getFeedback(id);
      if (feedback) {
        res.status(200).json(feedback);
      } else {
        res.status(404).json({ error: 'Feedback not found' });
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ error: 'Failed to fetch feedback' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updated = await editFeedback(id, req.body);
      if (updated) {
        res.status(200).json(updated);
      } else {
        res.status(404).json({ error: 'Feedback not found' });
      }
    } catch (error: any) {
      console.error('Error updating feedback:', error);
      res.status(400).json({ error: error.message || 'Failed to update feedback' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const removed = await removeFeedback(id);
      if (removed) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Feedback not found' });
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      res.status(500).json({ error: 'Failed to delete feedback' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
