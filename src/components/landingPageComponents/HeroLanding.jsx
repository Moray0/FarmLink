import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const HeroLanding = () => (
    <section className="relative mb-0 flex min-h-140 items-center overflow-hidden">
        <motion.img src="herobg.png" alt="Fresh agricultural farm crops and vegetables" animate={{ scale: [1, 1.035, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 h-full w-full object-cover object-[75%_center] sm:object-center" />
        <div className="absolute inset-0 bg-linear-to-r from-green-950 via-green-950/85 to-black/20" />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-green-400/15 blur-3xl" />
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 1.2, ease: 'easeOut' }} className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" />
        <motion.div animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-[12%] top-1/4 hidden text-5xl opacity-70 drop-shadow-lg sm:block" aria-hidden="true">🌿</motion.div>
        <div className="relative mx-auto w-full max-w-7xl px-6 py-16 text-white sm:px-8 sm:py-24 lg:px-10">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="max-w-3xl">
                <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Connecting <span className="text-green-400">Farmers</span> Directly With <span className="text-green-300">Buyers</span></h1>
                <p className="mb-8 text-base font-normal leading-relaxed text-green-100 sm:text-xl">Skip the middlemen. Buy fresh, organic produce straight from local growers at fair prices, or sell your harvests directly to thousands of ready buyers.</p>
                <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}><Link to="/marketplace" className="block rounded-xl bg-green-500 px-8 py-3.5 text-center font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-xl">Browse Fresh Produce</Link></motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}><Link to="/farmer-signup" className="block rounded-xl border border-white/40 bg-white/10 px-8 py-3.5 text-center font-semibold text-white backdrop-blur-xs transition-all hover:bg-white/20">Join as a Farmer</Link></motion.div>
                </div>
                <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/20 pt-8 text-left sm:gap-8">
                    <div><p className="text-2xl font-bold text-white sm:text-3xl">100%</p><p className="mt-1 text-xs text-green-200 sm:text-sm">Direct From Farm</p></div>
                    <div><p className="text-2xl font-bold text-white sm:text-3xl">500+</p><p className="mt-1 text-xs text-green-200 sm:text-sm">Verified Farmers</p></div>
                    <div><p className="text-2xl font-bold text-white sm:text-3xl">0%</p><p className="mt-1 text-xs text-green-200 sm:text-sm">Middlemen Fees</p></div>
                </div>
            </motion.div>
        </div>
    </section>
);

export default HeroLanding;
