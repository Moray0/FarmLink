import { useEffect, useRef, useState } from 'react';
import {
    collection,
    doc,
    onSnapshot,
    query,
    where,
    writeBatch,
} from 'firebase/firestore';
import { PiBell } from 'react-icons/pi';
import { db } from '../firebase.js';
import { useAuth } from '../auth/AuthContext';

const toMillis = (value) =>
    typeof value?.toMillis === 'function' ? value.toMillis() : Date.now();

const timeAgo = (value) => {
    const seconds = Math.max(
        0,
        Math.round((Date.now() - toMillis(value)) / 1000)
    );

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

    return `${Math.floor(seconds / 86400)}d ago`;
};

const NotificationBell = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Listen for this user's notifications in real time.
    useEffect(() => {
        if (!user?.uid) return undefined;

        const stop = onSnapshot(
            query(
                collection(db, 'notifications'),
                where('userId', '==', user.uid)
            ),
            (snapshot) => {
                const loaded = snapshot.docs
                    .map((item) => ({ id: item.id, ...item.data() }))
                    .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
                    .slice(0, 30);

                setItems(loaded);
            },
            (error) => {
                console.error('Could not load notifications:', error);
            }
        );

        return stop;
    }, [user?.uid]);

    // Close the panel when clicking outside it.
    useEffect(() => {
        if (!open) return undefined;

        const handleClick = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);

        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const unread = items.filter((item) => item.read !== true);

    const markAllRead = async () => {
        if (unread.length === 0) return;

        try {
            const batch = writeBatch(db);

            unread.forEach((item) => {
                batch.update(doc(db, 'notifications', item.id), {
                    read: true,
                });
            });

            await batch.commit();
        } catch (error) {
            console.error('Could not mark notifications as read:', error);
        }
    };

    const togglePanel = () => {
        setOpen((previous) => !previous);
    };

    if (!user) return null;

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={togglePanel}
                className="relative rounded-lg border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50"
                aria-label={`Notifications${unread.length ? `, ${unread.length} unread` : ''}`}
            >
                <PiBell className="h-5 w-5" />

                {unread.length > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                        {unread.length > 9 ? '9+' : unread.length}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-80 max-w-[85vw] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <h2 className="text-sm font-bold text-gray-900">
                            Notifications
                        </h2>

                        <button
                            onClick={markAllRead}
                            disabled={unread.length === 0}
                            className="text-xs font-semibold text-green-700 hover:underline disabled:text-gray-400 disabled:no-underline"
                        >
                            Mark all read
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {items.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-gray-500">
                                You have no notifications yet.
                            </p>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`border-b border-gray-100 px-4 py-3 ${
                                        item.read === true ? 'bg-white' : 'bg-green-50'
                                    }`}
                                >
                                    <p className="text-sm font-semibold text-gray-900">
                                        {item.title}
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-600">
                                        {item.message}
                                    </p>

                                    <p className="mt-1 text-[11px] text-gray-400">
                                        {timeAgo(item.createdAt)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
