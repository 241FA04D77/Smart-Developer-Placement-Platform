import jwt from 'jsonwebtoken';
export default function auth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'devtrack-ai' });
    if (!payload.id) return res.status(401).json({ message: 'Invalid authentication token.' });
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or has expired. Please sign in again.' });
  }
}
