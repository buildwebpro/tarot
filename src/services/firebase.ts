import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { UserProfile } from '../types/firebase';

export const authService = {
  async register(email: string, password: string, displayName?: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Auth user created:', userCredential.user.uid);

      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email,
        displayName: displayName || undefined,
        isPremium: false,
        credits: 0,
        freeReadingsCount: 0,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      console.log('Firestore document created for:', userCredential.user.uid);

      return userCredential.user;
    } catch (error: any) {
      console.error('Registration error:', error.code, error.message);
      throw error;
    }
  },

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastLoginAt: serverTimestamp(),
    });

    return userCredential.user;
  },

  async logout() {
    await signOut(auth);
  },

  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  },

  async incrementFreeReadings(uid: string): Promise<number> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    const currentCount = userSnap.data()?.freeReadingsCount || 0;
    
    await updateDoc(userRef, {
      freeReadingsCount: currentCount + 1,
    });
    
    return currentCount + 1;
  },

  async upgradeToPremium(uid: string) {
    await updateDoc(doc(db, 'users', uid), {
      isPremium: true,
    });
  },
};
