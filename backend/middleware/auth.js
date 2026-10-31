const jwt = require('jsonwebtoken');

const cookieName = 'session';
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function createSessionCookie(res, userId) {
  const token = jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie(cookieName, token, cookieOptions);
}

function clearSessionCookie(res) {
  res.clearCookie(cookieName, {
    httpOnly: cookieOptions.httpOnly,
    sameSite: cookieOptions.sameSite,
    secure: cookieOptions.secure,
    path: cookieOptions.path,
  });
}

function requireAuth(req, res, next) {
  const token = req.cookies[cookieName];
  if (!token) {
    return res.status(401).json({ error: 'Please sign in to continue.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.authUserId = payload.sub;
    return next();
  } catch {
    clearSessionCookie(res);
    return res.status(401).json({ error: 'Your session expired. Please sign in again.' });
  }
}

module.exports = { createSessionCookie, clearSessionCookie, requireAuth };
