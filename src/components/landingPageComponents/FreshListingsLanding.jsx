import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { freshListings } from './landingData';

const FreshListingsLanding = () => (
    <section id="listings" className="mb-0 w-full bg-green-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="mb-2 text-2xl font-bold text-green-900 sm:text-3xl">Fresh Listings</h2>
            <p className="text-sm text-gray-600 sm:text-base">Recently harvested produce available directly from local farms.</p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {freshListings.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.06 }} whileHover={{ y: -6 }} className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl">
                    <div className="overflow-hidden"><motion.img whileHover={{ scale: 1.08 }} transition={{ duration: 0.4 }} src={item.image} alt={item.name} className="h-48 w-full object-cover" /></div>
                    <div className="space-y-2 p-4">
                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.farmer} • {item.location}</p>
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                            <span className="text-lg font-bold text-green-700">{item.price}<span className="text-xs font-normal text-gray-500"> / {item.unit}</span></span>
                            <Link to="/marketplace" className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700">Order Now</Link>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
        <div className="mt-10 text-center"><Link to="/marketplace" className="text-base font-semibold text-green-800 hover:text-green-600 hover:underline">View More →</Link></div>
    </section>
);

export default FreshListingsLanding;
