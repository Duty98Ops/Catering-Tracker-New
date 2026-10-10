import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// 1. Login / Sign Up dengan Google (Popup)
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Sync to Firestore /users collection
    try {
      await setDoc(
        doc(db, 'users', result.user.uid),
        {
          uid: result.user.uid,
          displayName: result.user.displayName || 'Pengguna Google',
          email: result.user.email || '',
          cateringName: `${result.user.displayName || 'Katering'} (Google)`,
          role: 'owner',
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Could not sync user to Firestore:', e);
    }
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// 2. Login dengan Email & Password
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error: any) {
    console.error('Email Login Error:', error);
    throw error;
  }
}

// 3. Sign Up / Buat Akun Baru dengan Email & Password
export async function registerWithEmail(
  email: string,
  pass: string,
  name: string,
  businessName?: string
): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (name.trim()) {
      await updateProfile(result.user, {
        displayName: name.trim(),
      });
    }
    // Save to Firestore /users collection
    try {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        displayName: name.trim() || email.split('@')[0],
        email: result.user.email,
        cateringName: businessName?.trim() || `${name.trim() || 'Katering'} (Akun Baru)`,
        role: 'owner',
        description: 'Akun katering terdaftar via aplikasi.',
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Could not save user profile to Firestore:', e);
    }
    return result.user;
  } catch (error: any) {
    console.error('Email Register Error:', error);
    throw error;
  }
}

// 4. Logout / Keluar
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
}

// 5. Listener status autentikasi real-time
export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
