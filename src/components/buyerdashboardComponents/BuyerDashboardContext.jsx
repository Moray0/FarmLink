import { createContext, useContext } from 'react';

const BuyerDashboardContext = createContext(null);

export const BuyerDashboardStateProvider = ({ value, children }) => (
    <BuyerDashboardContext.Provider value={value}>
        {children}
    </BuyerDashboardContext.Provider>
);

export const useBuyerDashboard = () => {
    const context = useContext(BuyerDashboardContext);

    if (!context) {
        throw new Error('useBuyerDashboard must be used inside BuyerDashboardStateProvider');
    }

    return context;
};
