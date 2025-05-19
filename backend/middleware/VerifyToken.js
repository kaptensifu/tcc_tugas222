import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  console.log("Verifying token with secret:", process.env.ACCESS_TOKEN_SECRET);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT verification error:", err.message);
      return res.sendStatus(403);
    }
    req.name = decoded.name;
    next();
  });
};
