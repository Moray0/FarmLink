import { createContext, useContext } from 'react';

const MarketplaceContext = createContext(null);

export const MarketplaceStateProvider = ({ value, children }) => (
    <MarketplaceContext.Provider value={value}>
        {children}
    </MarketplaceContext.Provider>
);

export const useMarketplace = () => {
    const context = useContext(MarketplaceContext);
    if (!context) throw new Error('useMarketplace must be used inside MarketplaceStateProvider');
    return context;
};
