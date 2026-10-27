import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

export const orderLabel = (orderId) =>
    `ORD-${String(orderId).slice(0, 6).toUpperCase()}`;

// Queue a notification inside a write batch or transaction so it is saved
// together with the change it describes.
export function queueNotification(
    writer,
    { userId, actorId, type, title, message, orderId = '' }
) {
    writer.set(doc(collection(db, 'notifications')), {
        userId,
        actorId,
        type,
        title,
        message,
        orderId,
        read: false,
        createdAt: serverTimestamp(),
    });
}
