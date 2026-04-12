import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const user = new User({
      ...req.body,
      image: req.file?.filename,
    });

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
