import { createContext, useContext } from 'react';

const AdminDashboardContext = createContext(null);

export const AdminDashboardStateProvider = ({ value, children }) => (
    <AdminDashboardContext.Provider value={value}>
        {children}
    </AdminDashboardContext.Provider>
);

export const useAdminDashboard = () => {
    const context = useContext(AdminDashboardContext);
    if (!context) {
        throw new Error('Admin dashboard components must be rendered inside AdminDashboardProvider.');
    }
    return context;
};
