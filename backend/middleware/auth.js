import { getAuth } from "@clerk/express";

export const requireAuth1 = (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.userId = userId; // attach for later use
  next();
};
