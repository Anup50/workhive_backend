const jwt = require("jsonwebtoken");
const SECRET_KEY =
  "fef3b170bd182cb817e569f32af534fa372e5eab3b537a5e2b5a06f3a9522c260afa3aa440463b3c32d09177edd60dc8d9f9e8fb56ca4a6684f24e5a44835360";

function authenticateToken(req, res, next) {
  console.log("Authorization header:", req.header("Authorization"));
  console.log("Cookies:", req.cookies);

  let token = req.header("Authorization")?.split(" ")[1];

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).send("Access denied: No token provided");
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (e) {
    res.status(400).send("Invalid token");
  }
}

function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send("Access Denied: Insufficient Permissions");
    }
    next();
  };
}

function allowSelfOrRole(role) {
  return (req, res, next) => {
    if (req.params.id === req.user.id || req.user.role === role) {
      next();
    } else {
      res.status(403).send("Access Denied: Insufficient Permissions");
    }
  };
}

module.exports = { authenticateToken, authorize, allowSelfOrRole };
