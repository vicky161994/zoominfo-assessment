const JWT = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

module.exports = generateToken = (user) => {
  return JWT.sign(
    {
      _id: user._id,
      name: user.fullName,
      email: user.email,
      number: user.number,
    },
    process.env.JWT_SECRET || "itssupersecret",
    {
      expiresIn: "7d",
    }
  );
};

module.exports = trimInputData = (payload) => {
  let keys = Object.keys(payload);
  for (let i = 0; i < keys.length; i++) {
    if (payload[keys[i]]) {
      payload[keys[i]] = payload[keys[i]].trim();
    }
  }
  return payload;
};

module.exports = generateUniqueID = () => {
  const uuid = uuidv4();
  return uuid;
};

module.exports = setPageAndLimit = (req) => {
  let skip = 0;
  let { page, limit } = req.query;
  if (!page) {
    page = 1;
  }
  if (!limit) {
    limit = 10;
  }
  skip = (page - 1) * limit;
  return { skip: parseInt(skip), limit: parseInt(limit) };
};

module.exports = {
  generateToken,
  trimInputData,
  generateUniqueID,
  setPageAndLimit,
};
