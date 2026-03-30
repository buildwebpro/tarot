import { collection, getDocs, doc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserProfile } from '../types/firebase';

export const usersService = {
  async getAllUsers(): Promise<UserProfile[]> {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserProfile);
    });
    // Sort by createdAt descending
    users.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    return users;
  },

  async topUpCredits(uid: string, amount: number): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      credits: increment(amount),
    });
  },

  async deductCredit(uid: string): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      credits: increment(-1),
    });
  },

  async updateUser(uid: string, data: Partial<UserProfile>): Promise<void> {
    await updateDoc(doc(db, 'users', uid), data);
  },

  async deleteUser(uid: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid));
  },
};
