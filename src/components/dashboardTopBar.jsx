import { Link } from 'react-router-dom';
import {PiArrowLeftBold} from 'react-icons/pi';

const DashboardTopBar = () => {
    return (
        <div className="flex justify-end px-4 pt-4 sm:px-6">
            <Link
                to="/buyerdashboard"
                className="flex items-center rounded-lg border-none px-4 py-2 text-sm font-semibold text-white"
            >
                <PiArrowLeftBold size={18} />
                Return to dashboard
            </Link>
        </div>
    );
};

export default DashboardTopBar;