const ActivityLog = require("../models/ActivityLog");

/**
 * Utility to log user activities in the backend.
 * @param {string|null} userId - The user ID performing the action, or null if unauthenticated.
 * @param {string} action - The action name (e.g., 'LOGIN', 'CREATE_ARTWORK').
 * @param {string} description - Brief details about the action.
 * @param {object} req - Express request object to extract IP address.
 */
const logActivity = async (userId, action, description, req) => {
  try {
    let ipAddress = "";
    if (req) {
      ipAddress =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        req.ip ||
        "";
    }

    await ActivityLog.create({
      user: userId || null,
      action,
      description,
      ip_address: ipAddress,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

module.exports = logActivity;
