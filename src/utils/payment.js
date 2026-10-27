// Demo payment helpers. No real money moves and no card data is ever sent
// anywhere: only the brand and last four digits are kept on the order.
const digitsOnly = (value) => String(value || '').replace(/\D/g, '');

export const DEMO_CARDS = [
    { number: '4242 4242 4242 4242', result: 'Payment succeeds' },
    { number: '4000 0000 0000 0002', result: 'Card declined' },
    { number: '4000 0000 0000 9995', result: 'Insufficient funds' },
];

export function detectBrand(number) {
    const digits = digitsOnly(number);

    if (/^4/.test(digits)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard';
    if (/^(506|650)/.test(digits)) return 'Verve';

    return 'Card';
}

export function formatCardNumber(value) {
    return digitsOnly(value)
        .slice(0, 19)
        .replace(/(.{4})/g, '$1 ')
        .trim();
}

export function formatExpiry(value) {
    const digits = digitsOnly(value).slice(0, 4);

    return digits.length > 2
        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
        : digits;
}

function passesLuhn(digits) {
    let sum = 0;
    let double = false;

    for (let index = digits.length - 1; index >= 0; index -= 1) {
        let digit = Number(digits[index]);

        if (double) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        double = !double;
    }

    return sum % 10 === 0;
}

// Returns an error message, or an empty string when the card details are valid.
export function validateCard({ name, number, expiry, cvv }) {
    if (!name.trim()) return 'Enter the name on the card.';

    const digits = digitsOnly(number);

    if (digits.length < 13 || digits.length > 19 || !passesLuhn(digits)) {
        return 'Enter a valid card number.';
    }

    const match = /^(\d{2})\/(\d{2})$/.exec(expiry);

    if (!match || Number(match[1]) < 1 || Number(match[1]) > 12) {
        return 'Enter the expiry date as MM/YY.';
    }

    const now = new Date();
    const year = 2000 + Number(match[2]);
    const month = Number(match[1]);

    if (
        year < now.getFullYear() ||
        (year === now.getFullYear() && month < now.getMonth() + 1)
    ) {
        return 'This card has expired.';
    }

    if (!/^\d{3,4}$/.test(cvv)) {
        return 'Enter the 3 or 4 digit security code.';
    }

    return '';
}

// Pretends to charge the card. Resolves with a receipt or throws a decline.
export async function processDemoPayment({ number }) {
    await new Promise((resolve) => setTimeout(resolve, 1600));

    const digits = digitsOnly(number);

    if (digits === '4000000000000002') {
        throw new Error('Your card was declined. Please try another card.');
    }

    if (digits === '4000000000009995') {
        throw new Error('Your card has insufficient funds.');
    }

    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

    return {
        reference: `FLP-${Date.now().toString(36).toUpperCase()}${suffix}`,
        brand: detectBrand(digits),
        last4: digits.slice(-4),
    };
}
