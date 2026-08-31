<<<<<<< HEAD
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  User,
} from 'firebase/auth';

import { auth } from './firebase';
=======
import { supabase } from './supabaseClient';
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f

export async function signUp(
  email: string,
  password: string
) {
<<<<<<< HEAD
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await sendEmailVerification(result.user);

  return result;
=======
  return await supabase.auth.signUp({
    email,
    password,
  });
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
}

export async function signIn(
  email: string,
  password: string
) {
<<<<<<< HEAD
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export async function signOut() {
  return await firebaseSignOut(auth);
}

export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
=======
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
}