import { PiX } from 'react-icons/pi';
import { useFarmerDirectory } from './FarmerDirectoryContext';

const ContactFarmerModal = () => {
    const {
        closeContactForm, contactError, contactFarmer, contactMessage, contactSent,
        sendContactMessage, sendingContact, setContactMessage, user,
    } = useFarmerDirectory();

    if (!contactFarmer) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Contact {contactFarmer.farmName}</h2>
                        <p className="mt-1 text-sm text-gray-500">Send a short message to this farmer.</p>
                    </div>
                    <button type="button" onClick={closeContactForm} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close contact form"><PiX className="h-5 w-5" /></button>
                </div>
                {!user && <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Please log in as a buyer before sending a message.</p>}
                {contactSent ? (
                    <div className="mt-5 rounded-lg bg-green-50 p-4 text-sm text-green-800">Your message was sent. The farmer will see it in their notifications.</div>
                ) : (
                    <form onSubmit={sendContactMessage} className="mt-5 space-y-4">
                        <div>
                            <label htmlFor="farmer-message" className="block text-sm font-medium text-gray-700">Your message</label>
                            <textarea id="farmer-message" value={contactMessage} onChange={(event) => setContactMessage(event.target.value)} maxLength={220} rows={4} placeholder="Ask about product availability, price, or delivery." className="mt-1 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            <p className="mt-1 text-right text-xs text-gray-400">{contactMessage.length}/220</p>
                        </div>
                        {contactError && <p role="alert" className="text-sm text-red-600">{contactError}</p>}
                        <button type="submit" disabled={sendingContact || !user} className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">{sendingContact ? 'Sending...' : 'Send Message'}</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactFarmerModal;
