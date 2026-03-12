import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'node:fs';
import path from 'node:path';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'questoes.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.status(200).send(content);
  } catch (error: any) {
    res.status(500).json({ error: 'questoes_unavailable', detail: String(error?.message || error) });
  }
}
