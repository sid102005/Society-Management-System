const crypto = require("crypto");

function generateShareToken() {
  return crypto.randomBytes(32).toString("hex");
}

function buildDashboardProfile(resident, familyMembers, vehicles) {
  const profile = resident.toObject ? resident.toObject() : { ...resident };

  return {
    ...profile,
    flatDetails: {
      flatNumber: profile.flatNumber || "",
      wing: profile.wing || "",
      floor: profile.floor || "",
      societyName: profile.societyName || "",
    },
    familyMemberCount: familyMembers.length,
    vehicleCount: vehicles.length,
  };
}

module.exports = {
  generateShareToken,
  buildDashboardProfile,
};
