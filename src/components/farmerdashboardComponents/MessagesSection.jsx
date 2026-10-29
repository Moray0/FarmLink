import { PiChatDots } from 'react-icons/pi';
import { useFarmerDashboard } from './FarmerDashboardContext';

const MessagesSection = () => {
    const {
        activeTab, formatDate, markMessageAsRead, messages, messagesError, messagesLoading,
    } = useFarmerDashboard();
    if (activeTab !== 'Messages') return null;

    return (
        <>
            <div><h1 className="text-2xl font-bold text-gray-900">Messages</h1><p className="mt-1 text-sm text-gray-600">Keep track of communication with buyers.</p></div>
            {messagesError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{messagesError}</div>}
            <div className="space-y-4">
                {messagesLoading ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center"><p className="text-sm text-gray-500">Loading messages...</p></div>
                ) : messages.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                        <PiChatDots className="mx-auto mb-3 h-12 w-12 text-green-600" />
                        <h2 className="text-lg font-bold text-gray-900">No buyer messages yet</h2>
                        <p className="mt-2 text-sm text-gray-500">Messages sent from your farmer card will appear here.</p>
                    </div>
                ) : messages.map((message) => (
                    <div key={message.id} className={`rounded-xl border p-5 ${message.read === true ? 'border-gray-200 bg-white' : 'border-green-200 bg-green-50'}`}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-gray-900">{message.title || 'Message from a buyer'}</h2>{message.read !== true && <span className="rounded-full bg-green-600 px-2 py-1 text-[11px] font-semibold text-white">New</span>}</div>
                                <p className="mt-1 whitespace-pre-line text-sm text-gray-700">{message.message}</p>
                            </div>
                            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                                <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                                {message.read !== true && <button type="button" onClick={() => markMessageAsRead(message.id)} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm hover:bg-green-100">Mark as read</button>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default MessagesSection;
