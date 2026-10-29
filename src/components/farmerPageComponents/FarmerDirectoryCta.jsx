import { Link } from 'react-router-dom';
import { PiPlant } from 'react-icons/pi';

const FarmerDirectoryCta = () => (
    <section className="bg-green-700 px-4 py-16 text-white sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
            <PiPlant className="mx-auto mb-4 h-12 w-12 text-green-300" />
            <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Are You a Farmer?</h2>
            <p className="mx-auto mb-6 max-w-xl text-sm text-green-100 sm:text-base">
                Join FarmLink and sell your fresh produce directly to buyers. No middlemen, no hidden fees — just fair prices for your hard work.
            </p>
            <Link to="/farmer-signup" className="inline-block rounded-xl bg-white px-8 py-3 font-semibold text-green-700 shadow-lg hover:bg-green-50">Register as a Farmer</Link>
        </div>
    </section>
);

export default FarmerDirectoryCta;
