import { kv } from '@vercel/kv';

const VALID_PARK_CODES = ['MNSHAF', 'MNRFC', 'MNWAT', 'MOGV', 'MOASH', 'MISOL'];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Get all parks data
      const parks = [];
      
      for (const code of VALID_PARK_CODES) {
        const parkData = await kv.get(`park:${code}`);
        if (parkData) {
          parks.push(parkData);
        }
      }
      
      // Sort by last_updated descending
      parks.sort((a, b) => {
        const dateA = new Date(a.last_updated || 0);
        const dateB = new Date(b.last_updated || 0);
        return dateB - dateA;
      });
      
      res.status(200).json(parks);
    } catch (error) {
      console.error('Error fetching parks:', error);
      res.status(500).json({ error: 'Failed to fetch parks data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}