import { motion } from 'motion/react';
import { testimonials } from './landingData';

const TestimonialLanding = () => (
    <section className="my-0 border-y border-green-100 bg-green-50/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
                <h2 className="mb-2 mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">What Our Farmers & Buyers Say</h2>
                <p className="text-sm text-gray-600 sm:text-base">Discover how FarmLink is making agriculture profitable for farmers and convenient for buyers.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                    <motion.div key={testimonial.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: testimonial.id * 0.08 }} whileHover={{ y: -5 }} className="flex flex-col justify-between rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg sm:p-7">
                        <div><div className="mb-4 flex text-sm text-amber-400">{'★'.repeat(testimonial.rating)}</div><p className="mb-6 text-sm italic leading-relaxed text-gray-700">"{testimonial.quote}"</p></div>
                        <div className="flex items-center gap-3 border-t border-gray-100 pt-4"><img src={testimonial.photo} alt={testimonial.name} className="h-11 w-11 rounded-full border-2 border-green-200 object-cover" /><div><h4 className="text-sm font-bold text-gray-900">{testimonial.name}</h4><p className="text-xs font-medium text-green-700">{testimonial.role}</p></div></div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default TestimonialLanding;
