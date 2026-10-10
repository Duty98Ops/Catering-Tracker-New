import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { Transaction, Supplier, IngredientBenchmark } from '../types';
import { INITIAL_TRANSACTIONS, INITIAL_SUPPLIERS, INGREDIENT_BENCHMARKS } from '../data/initialData';

const TRANSACTIONS_PATH = 'transactions';
const TRASH_PATH = 'trash';
const SUPPLIERS_PATH = 'suppliers';
const INGREDIENTS_PATH = 'ingredients';

// Subscribe to suppliers collection with user isolation
export function subscribeToSuppliers(
  targetUserId: string = 'guest',
  onData: (items: Supplier[]) => void
) {
  try {
    const colRef = collection(db, SUPPLIERS_PATH);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const allItems: Supplier[] = [];
        snapshot.forEach((d) => {
          allItems.push(d.data() as Supplier);
        });
        const items =
          targetUserId === 'guest'
            ? allItems.filter((s) => !s.userId || s.userId === 'guest')
            : allItems.filter((s) => s.userId === targetUserId);
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, SUPPLIERS_PATH);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, SUPPLIERS_PATH);
  }
}

// Add supplier doc to Firestore
export async function addSupplierDoc(sup: Supplier) {
  const docRef = doc(db, SUPPLIERS_PATH, sup.id);
  try {
    await setDoc(docRef, sup);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${SUPPLIERS_PATH}/${sup.id}`);
  }
}

// Update supplier doc in Firestore
export async function updateSupplierDoc(sup: Supplier) {
  const docRef = doc(db, SUPPLIERS_PATH, sup.id);
  try {
    await setDoc(docRef, sup, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SUPPLIERS_PATH}/${sup.id}`);
  }
}

// Delete supplier doc from Firestore
export async function deleteSupplierDoc(id: string) {
  const docRef = doc(db, SUPPLIERS_PATH, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${SUPPLIERS_PATH}/${id}`);
  }
}

// Subscribe to ingredients benchmarks collection
export function subscribeToIngredients(onData: (items: IngredientBenchmark[]) => void) {
  try {
    const colRef = collection(db, INGREDIENTS_PATH);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: IngredientBenchmark[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as IngredientBenchmark);
        });
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, INGREDIENTS_PATH);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, INGREDIENTS_PATH);
  }
}

// Add/update ingredient doc in Firestore
export async function updateIngredientDoc(ing: IngredientBenchmark) {
  const docRef = doc(db, INGREDIENTS_PATH, ing.id);
  try {
    await setDoc(docRef, ing);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${INGREDIENTS_PATH}/${ing.id}`);
  }
}

// Subscribe to all transactions regardless of user (for Firestore structure inspector)
export function subscribeToAllTransactions(onData: (items: Transaction[]) => void) {
  try {
    const colRef = collection(db, TRANSACTIONS_PATH);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: Transaction[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as Transaction);
        });
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, TRANSACTIONS_PATH);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, TRANSACTIONS_PATH);
  }
}

// Subscribe to transactions with real-time updates and user-isolation
export function subscribeToTransactions(
  targetUserId: string = 'guest',
  onData: (items: Transaction[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, TRANSACTIONS_PATH);
    return onSnapshot(
      colRef,
      async (snapshot) => {
        if (snapshot.empty) {
          if (targetUserId === 'guest') {
            // Auto-seed initial demo transactions to Firestore only for guest mode
            try {
              const batch = writeBatch(db);
              INITIAL_TRANSACTIONS.forEach((trx) => {
                const docRef = doc(db, TRANSACTIONS_PATH, trx.id);
                batch.set(docRef, { ...trx, userId: 'guest' });
              });
              await batch.commit();
            } catch (seedErr) {
              console.warn('Seeding failed, using local initial data:', seedErr);
              onData(INITIAL_TRANSACTIONS);
            }
          } else {
            // New user account starts completely empty
            onData([]);
          }
          return;
        }

        const allItems: Transaction[] = [];
        snapshot.forEach((d) => {
          allItems.push(d.data() as Transaction);
        });

        // Filter based on user isolation mode
        let items: Transaction[] = [];
        if (targetUserId === 'guest') {
          items = allItems.filter((t) => !t.userId || t.userId === 'guest');
        } else {
          // Personal account: strictly isolated to user's own transactions
          // Brand new user account starts completely empty (0 transactions)
          items = allItems.filter((t) => t.userId === targetUserId);
        }

        // Sort descending by date & time
        items.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
          const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
          return dateB - dateA;
        });

        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, TRANSACTIONS_PATH);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, TRANSACTIONS_PATH);
  }
}

// Subscribe to trash/archive collection
export function subscribeToTrash(
  targetUserId: string = 'guest',
  onData: (items: Transaction[]) => void
) {
  try {
    const colRef = collection(db, TRASH_PATH);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const allItems: Transaction[] = [];
        snapshot.forEach((d) => {
          allItems.push(d.data() as Transaction);
        });

        const items =
          targetUserId === 'guest'
            ? allItems.filter((t) => !t.userId || t.userId === 'guest')
            : allItems.filter((t) => t.userId === targetUserId);

        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, TRASH_PATH);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, TRASH_PATH);
  }
}

// Add transaction to Firestore
export async function addTransactionDoc(trx: Transaction) {
  const docRef = doc(db, TRANSACTIONS_PATH, trx.id);
  try {
    await setDoc(docRef, trx);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${TRANSACTIONS_PATH}/${trx.id}`);
  }
}

// Update transaction in Firestore
export async function updateTransactionDoc(trx: Transaction) {
  const docRef = doc(db, TRANSACTIONS_PATH, trx.id);
  try {
    await setDoc(docRef, trx, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${TRANSACTIONS_PATH}/${trx.id}`);
  }
}

// Move transaction to trash in Firestore
export async function moveTransactionToTrash(trx: Transaction) {
  const batch = writeBatch(db);
  const trxRef = doc(db, TRANSACTIONS_PATH, trx.id);
  const trashRef = doc(db, TRASH_PATH, trx.id);

  batch.delete(trxRef);
  batch.set(trashRef, trx);

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${TRANSACTIONS_PATH}/${trx.id}`);
  }
}

// Restore transaction from trash in Firestore
export async function restoreTransactionFromTrash(trx: Transaction) {
  const batch = writeBatch(db);
  const trxRef = doc(db, TRANSACTIONS_PATH, trx.id);
  const trashRef = doc(db, TRASH_PATH, trx.id);

  batch.delete(trashRef);
  batch.set(trxRef, trx);

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${TRASH_PATH}/${trx.id}`);
  }
}

// Delete permanently from trash
export async function deletePermanentlyFromTrash(trxId: string) {
  const docRef = doc(db, TRASH_PATH, trxId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${TRASH_PATH}/${trxId}`);
  }
}

// Clear all trash
export async function clearAllTrashDocs(trashItems: Transaction[]) {
  const batch = writeBatch(db);
  trashItems.forEach((t) => {
    batch.delete(doc(db, TRASH_PATH, t.id));
  });
  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, TRASH_PATH);
  }
}

// Reset data to initial demo in Firestore for the active user/guest scope
export async function resetFirestoreToDemo(targetUserId: string = 'guest') {
  const batch = writeBatch(db);

  // Get current transactions and clear only matching targetUserId
  const trxSnap = await getDocs(collection(db, TRANSACTIONS_PATH));
  trxSnap.forEach((d) => {
    const data = d.data();
    if (targetUserId === 'guest') {
      if (!data.userId || data.userId === 'guest') {
        batch.delete(d.ref);
      }
    } else {
      if (data.userId === targetUserId) {
        batch.delete(d.ref);
      }
    }
  });

  // Get trash and clear only matching targetUserId
  const trashSnap = await getDocs(collection(db, TRASH_PATH));
  trashSnap.forEach((d) => {
    const data = d.data();
    if (targetUserId === 'guest') {
      if (!data.userId || data.userId === 'guest') {
        batch.delete(d.ref);
      }
    } else {
      if (data.userId === targetUserId) {
        batch.delete(d.ref);
      }
    }
  });

  // Add initial transactions ONLY for guest mode. Personal accounts reset to empty (0 transactions).
  if (targetUserId === 'guest') {
    INITIAL_TRANSACTIONS.forEach((trx) => {
      const docId = trx.id;
      const docRef = doc(db, TRANSACTIONS_PATH, docId);
      batch.set(docRef, { ...trx, id: docId, userId: 'guest' });
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, TRANSACTIONS_PATH);
  }
}
