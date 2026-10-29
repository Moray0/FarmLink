import FarmerDirectory from '../components/farmerPageComponents/FarmerDirectory';
import FarmerDirectoryShell from '../components/farmerPageComponents/FarmerDirectoryShell';
import FarmerProfilesSection from '../components/farmerPageComponents/FarmerProfilesSection';
import FarmerDirectoryCta from '../components/farmerPageComponents/FarmerDirectoryCta';
import ContactFarmerModal from '../components/farmerPageComponents/ContactFarmerModal';

const FarmerPage = () => (
    <FarmerDirectory>
        <FarmerDirectoryShell>
            <FarmerProfilesSection />
            <FarmerDirectoryCta />
        </FarmerDirectoryShell>
        <ContactFarmerModal />
    </FarmerDirectory>
);

export default FarmerPage;
