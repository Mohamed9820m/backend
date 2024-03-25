const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get the token from the cookie
  const token = req.cookies.Token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'your-secret-key');
    req.userId = decoded.userId; // Add userId to the request object

    console.log(token);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;
