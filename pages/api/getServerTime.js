export default function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end('Use GET'); }
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).end(new Date().toString());
}
