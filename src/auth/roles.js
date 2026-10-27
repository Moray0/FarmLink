export const ADMIN_EMAILS = ["adeolaoyebimpe3@gmail.com"];

export function isAdminEmail(email) {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

// Where each role goes after signing in.
export const ROLE_HOME = {
    admin: "/admindashboard",
    farmer: "/farmerdashboard",
    buyer: "/buyerdashboard",
};

export const ROLE_LABEL = {
    admin: "Administrator",
    farmer: "Farmer",
    buyer: "Buyer",
};
