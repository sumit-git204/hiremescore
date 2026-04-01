const admin = require("firebase-admin");

// Initialize Firebase Admin without credentials for now
// so it doesn't crash if env vars are missing during setup.
try {
    if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
        console.log("Firebase Admin Initialized");
    } else {
        console.warn("FIREBASE_PROJECT_ID is not set. Firebase Admin not fully initialized.");
    }
} catch (error) {
    console.error("Firebase Admin Initialization Error", error);
}

module.exports = admin;
