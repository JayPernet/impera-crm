import { Navbar, Hero, Features, Pricing, AiSection, UrgencySection, Footer } from '@/components/landing';

/**
 * Sales Landing Page
 * 
 * Main landing page showcasing the Impera CRM ecosystem.
 * Features viewport animations and stagger effects via Framer Motion.
 */
export default function SalesPage() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Features />
                <AiSection />
                <UrgencySection />
                <Pricing />
            </main>
            <Footer />
        </>
    );
}
