import { createContext, useContext, useEffect, useState } from "react";
import {
createUserWithEmailAndPassword,
GoogleAuthProvider,
onAuthStateChanged,
signInWithEmailAndPassword,
signInWithPopup,
signOut,
updateProfile,
} from "firebase/auth";
import {
doc,
getDoc,
serverTimestamp,
setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase.js";
import { isAdminEmail } from "./roles.js";
import { friendlyError } from "./authErrors.js";

const AuthContext = createContext(null);

const pendingSignUps = new Map();
const profileCache = new Map();
const profileLoads = new Map();

async function syncFarmerPublicProfile(firebaseUser, profile) {
if (profile.role !== "farmer") return;

const publicRef = doc(db, "farmerProfiles", firebaseUser.uid);
const publicSnapshot = await getDoc(publicRef);

const publicProfile = {
    uid: firebaseUser.uid,
    displayName: profile.displayName || "",
    farmName: profile.farmName || "",
    location: profile.location || "",
    role: "farmer",
};

if (publicSnapshot.exists()) {
    await setDoc(publicRef, publicProfile, { merge: true });
} else {
    await setDoc(publicRef, {
        ...publicProfile,
        verified: false,
        createdAt: serverTimestamp(),
    });
}

}

async function loadProfile(firebaseUser) {
const uid = firebaseUser.uid;
const emailKey = (firebaseUser.email || "").toLowerCase();
const signupDetails = pendingSignUps.get(emailKey);

if (profileCache.has(uid)) {
    const cachedProfile = profileCache.get(uid);
    await syncFarmerPublicProfile(firebaseUser, cachedProfile);
    return cachedProfile;
}

if (profileLoads.has(uid)) {
    return profileLoads.get(uid);
}

const profilePromise = (async () => {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    let profile;

    if (snapshot.exists()) {
        profile = snapshot.data();

        // During signup, use the role and details supplied by the form.
        if (signupDetails) {
            profile = {
                ...profile,
                uid,
                email: firebaseUser.email || "",
                displayName: signupDetails.name,
                role: isAdminEmail(firebaseUser.email)
                    ? "admin"
                    : signupDetails.role,
                ...(signupDetails.role === "farmer"
                    ? {
                        farmName: signupDetails.farmName,
                        location: signupDetails.location,
                    }
                    : {}),
            };

            await setDoc(userRef, profile, { merge: true });
        }
    } else {
        profile = {
            uid,
            email: firebaseUser.email || "",
            displayName:
                signupDetails?.name ||
                firebaseUser.displayName ||
                "",
            role: isAdminEmail(firebaseUser.email)
                ? "admin"
                : signupDetails?.role || "buyer",
            createdAt: serverTimestamp(),
        };

        if (profile.role === "farmer") {
            profile.farmName = signupDetails?.farmName || "";
            profile.location = signupDetails?.location || "";
        }

        await setDoc(userRef, profile);

        profile = {
            ...profile,
            createdAt: new Date(),
        };
    }

    // Keep the administrator role determined by the configured email.
    if (isAdminEmail(firebaseUser.email)) {
        profile = { ...profile, role: "admin" };
    }

    await syncFarmerPublicProfile(firebaseUser, profile);

    profileCache.set(uid, profile);
    return profile;
})();

profileLoads.set(uid, profilePromise);

try {
    return await profilePromise;
} finally {
    profileLoads.delete(uid);
}

}

export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
const [justSignedUp, setJustSignedUp] = useState(false);
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);
const [authError, setAuthError] = useState("");

useEffect(() => {
    const stopListening = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setProfile(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const userProfile = await loadProfile(firebaseUser);

                setAuthError("");
                setUser(firebaseUser);
                setProfile(userProfile);
            } catch (error) {
                setAuthError(friendlyError(error));
                console.error("Failed to load user profile:", error);
            } finally {
                setLoading(false);
            }
        }
    );

    return stopListening;
}, []);

async function signUp({
    name,
    email,
    password,
    role,
    farmName = "",
    location = "",
}) {
    setAuthError("");

    const emailKey = email.toLowerCase();

    pendingSignUps.set(emailKey, {
        name,
        role,
        farmName,
        location,
    });

    try {
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(credential.user, {
            displayName: name,
        });

        // Remove any stale cached profile for this new account.
        profileCache.delete(credential.user.uid);

        const userProfile = await loadProfile(credential.user);
        setJustSignedUp(true);
        setUser(credential.user);
        setProfile(userProfile);

        return userProfile;
    } catch (error) {
        throw error;
    } finally {
        pendingSignUps.delete(emailKey);
    }
}

async function signIn(email, password) {
    setAuthError("");
    setJustSignedUp(false);

    await signInWithEmailAndPassword(auth, email, password);
}

async function signInWithGoogle(role = "buyer") {
    setAuthError("");

    await signInWithPopup(auth, new GoogleAuthProvider());

    // Existing Google accounts keep their saved role.
    // New Google accounts default to buyer unless their profile
    // was created through another signup flow.
}

async function logOut() {
    profileCache.clear();
    await signOut(auth);
}

const value = {
    user,
    profile,
    role: profile?.role ?? null,
    loading,
    authError,
    justSignedUp,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
};

return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
);

}

export function useAuth() {
return useContext(AuthContext);
}