import { doc, runTransaction, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../firebase.js';
import { orderLabel, queueNotification } from './notifications.js';

// Move an order forward (Pending -> Processing -> Completed) and tell the buyer.
export async function advanceOrder(order, nextStatus, actorUid, farmName) {
    const updates = { status: nextStatus };

    // Pay-on-delivery orders are marked paid once they are completed.
    if (nextStatus === 'Completed' && order.paymentMethod === 'cod') {
        updates.paymentStatus = 'Paid (Demo)';
    }

    const batch = writeBatch(db);

    batch.update(doc(db, 'orders', order.id), updates);

    queueNotification(batch, {
        userId: order.buyerId,
        actorId: actorUid,
        type: 'order_status',
        title: `Order ${orderLabel(order.id)} is ${nextStatus.toLowerCase()}`,
        message:
            nextStatus === 'Processing'
                ? `${farmName} has accepted your order and is preparing it.`
                : `${farmName} marked your order as completed.`,
        orderId: order.id,
    });

    await batch.commit();

    return updates;
}

// Cancel a pending order, put the stock back and notify the other side.
// A buyer cancels the whole order. A farmer can only decline an order that
// contains nothing but their own products.
export async function cancelOrder(order, actorUid, actorRole, actorName) {
    const result = { status: 'Cancelled', paymentStatus: 'Cancelled' };

    await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, 'orders', order.id);
        const orderSnapshot = await transaction.get(orderRef);

        if (!orderSnapshot.exists()) {
            throw new Error('This order no longer exists.');
        }

        const current = orderSnapshot.data();

        if (current.status !== 'Pending') {
            throw new Error('Only pending orders can be cancelled.');
        }

        const items = Array.isArray(current.items) ? current.items : [];

        // Add up the quantity to return for each product.
        const returns = new Map();

        items
            .filter(
                (item) =>
                    actorRole === 'buyer' || item.farmerId === actorUid
            )
            .forEach((item) => {
                returns.set(
                    item.productId,
                    (returns.get(item.productId) || 0) +
                        Number(item.quantity || 0)
                );
            });

        const productRefs = [...returns.keys()].map((productId) =>
            doc(db, 'products', productId)
        );

        const productSnapshots = await Promise.all(
            productRefs.map((ref) => transaction.get(ref))
        );

        productSnapshots.forEach((snapshot, index) => {
            if (!snapshot.exists()) return;

            const data = snapshot.data();

            // Products without a stock count are not tracked.
            if (typeof data.stock !== 'number') return;

            const restoredStock =
                data.stock + returns.get(productRefs[index].id);

            transaction.update(snapshot.ref, {
                stock: restoredStock,
                status: 'Available',
            });
        });

        result.paymentStatus =
            current.paymentStatus === 'Paid (Demo)'
                ? 'Refunded (Demo)'
                : 'Cancelled';

        transaction.update(orderRef, {
            status: 'Cancelled',
            paymentStatus: result.paymentStatus,
            cancelledAt: serverTimestamp(),
        });

        const label = orderLabel(order.id);

        if (actorRole === 'buyer') {
            (current.farmerIds || []).forEach((farmerId) => {
                queueNotification(transaction, {
                    userId: farmerId,
                    actorId: actorUid,
                    type: 'order_cancelled',
                    title: `Order ${label} was cancelled`,
                    message: `${actorName} cancelled this order. Your stock has been restored.`,
                    orderId: order.id,
                });
            });
        } else {
            queueNotification(transaction, {
                userId: current.buyerId,
                actorId: actorUid,
                type: 'order_cancelled',
                title: `Order ${label} was declined`,
                message:
                    result.paymentStatus === 'Refunded (Demo)'
                        ? `${actorName} could not fulfil your order. Your payment has been refunded (demo).`
                        : `${actorName} could not fulfil your order.`,
                orderId: order.id,
            });
        }
    });

    return result;
}
