import { motion, useScroll } from 'motion/react';
import Footer from '../footer';

const LandingPageShell = ({ children }) => {
    const { scrollYProgress } = useScroll();

    return (
        <>
            <motion.div id="scroll-indicator" style={{ scaleY: scrollYProgress, position: 'fixed', top: 0, left: 0, bottom: 0, width: 10, originY: 0, backgroundColor: '#16a34a', zIndex: 50 }} />
            <div className="space-y-20 pb-16">{children}</div>
            <Footer />
        </>
    );
};

export default LandingPageShell;
