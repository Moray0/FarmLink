import { createContext, useContext } from 'react';

const FarmerDashboardContext = createContext(null);

export const FarmerDashboardStateProvider = ({ value, children }) => (
    <FarmerDashboardContext.Provider value={value}>
        {children}
    </FarmerDashboardContext.Provider>
);

export const useFarmerDashboard = () => {
    const context = useContext(FarmerDashboardContext);
    if (!context) throw new Error('useFarmerDashboard must be used inside FarmerDashboardStateProvider');
    return context;
};
