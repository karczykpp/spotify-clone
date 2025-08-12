import { User } from "../models/user.model.js";
export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        fullName: `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl: imageUrl || "",
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
