import { createContext, useContext } from 'react';

const FarmerDirectoryContext = createContext(null);

export const FarmerDirectoryStateProvider = ({ value, children }) => (
    <FarmerDirectoryContext.Provider value={value}>
        {children}
    </FarmerDirectoryContext.Provider>
);

export const useFarmerDirectory = () => {
    const context = useContext(FarmerDirectoryContext);
    if (!context) {
        throw new Error('useFarmerDirectory must be used inside FarmerDirectoryStateProvider');
    }
    return context;
};
