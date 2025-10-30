import { NextApiRequest, NextApiResponse } from 'next';
import { listFeedbacks, addFeedback } from '../../../lib/controllers/feedbackController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const feedbacks = await listFeedbacks();
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      res.status(500).json({ error: 'Failed to fetch feedbacks' });
    }
  } else if (req.method === 'POST') {
    try {
      const feedback = await addFeedback(req.body);
      res.status(201).json(feedback);
    } catch (error: any) {
      console.error('Error creating feedback:', error);
      res.status(400).json({ error: error.message || 'Failed to create feedback' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
