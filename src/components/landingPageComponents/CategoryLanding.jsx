import { motion } from 'motion/react';
import { categories } from './landingData';

const CategoryLanding = () => (
    <section id="categories" className="mx-auto mt-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
            <h2 className="mb-2 mt-3 text-2xl font-bold text-green-900 sm:text-3xl">Browse by Category</h2>
            <p className="text-sm text-gray-600 sm:text-base">Find exactly what you need from our wide variety of freshly harvested crops.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {categories.map((category) => (
                <motion.a key={category.id} href="#listings" whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="group min-w-0 rounded-2xl border border-green-100 bg-white p-3 text-center shadow-sm transition-colors duration-200 hover:border-green-300 hover:shadow-lg sm:p-5">
                    <motion.div whileHover={{ y: -4, rotate: 5 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-3xl transition-colors group-hover:bg-green-100 sm:h-14 sm:w-14">{category.emoji}</motion.div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-800 transition-colors group-hover:text-green-700 sm:text-base">{category.name}</h3>
                    <span className="text-xs font-medium text-green-600">{category.count}</span>
                </motion.a>
            ))}
        </div>
    </section>
);

export default CategoryLanding;
