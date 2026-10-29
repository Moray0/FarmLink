import LandingPageShell from '../components/landingPageComponents/LandingPageShell';
import HeroLanding from '../components/landingPageComponents/HeroLanding';
import CategoryLanding from '../components/landingPageComponents/CategoryLanding';
import FreshListingsLanding from '../components/landingPageComponents/FreshListingsLanding';
import TestimonialLanding from '../components/landingPageComponents/TestimonialLanding';

const LandingPage = () => (
    <LandingPageShell>
        <HeroLanding />
        <CategoryLanding />
        <FreshListingsLanding />
        <TestimonialLanding />
    </LandingPageShell>
);

export default LandingPage;
