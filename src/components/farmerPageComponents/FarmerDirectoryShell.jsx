import { motion } from 'motion/react';
import Footer from '../footer';
import { FarmerDirectoryHero } from '../publicPageSections';
import DashboardTopBar from '../dashboardTopBar';
import { useFarmerDirectory } from './FarmerDirectoryContext';

const FarmerDirectoryShell = ({ children }) => {
    const { openedFromBuyerDashboard, scrollYProgress } = useFarmerDirectory();

    return (
        <>
            <motion.div style={{ scaleY: scrollYProgress, position: 'fixed', top: 0, left: 0, bottom: 0, width: 5, originY: 0, backgroundColor: '#16a34a', zIndex: 50 }} />
            <div className="min-h-screen bg-gray-50">
                <FarmerDirectoryHero topBar={openedFromBuyerDashboard ? <div className="bg-green-700"><DashboardTopBar /></div> : null} />
                {children}
            </div>
            <Footer />
        </>
    );
};

export default FarmerDirectoryShell;
