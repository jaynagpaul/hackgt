import { getUserFromId } from "../../../server/mongodb/actions/User";
import { withSessionRoute } from "../../../src/session";

// @route   GET api/user
// @desc    Get current user from cookie
// @access  Public
const handler = async (req, res) => {
  if (!req.session.user) {
    await req.session.save();
    return res.status(200).json({
      success: true,
      payload: {
        isLoggedIn: false,
      },
    });
  }

  const id = req.session.user?.id;
  try {
    const user = await getUserFromId(id);
    await req.session.save();
    return res.status(200).json({
      success: true,
      payload: {
        ...user,
        isLoggedIn: true,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default withSessionRoute(handler);
