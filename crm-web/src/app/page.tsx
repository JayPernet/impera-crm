import { Navbar, Hero, ProblemSection, Features, EarlyAdopterSection, FAQSection, Footer } from '@/components/landing';

/**
 * Sales Landing Page (MVP)
 * 
 * Main landing page showcasing the Impera CRM.
 * Structure: Hero → Problem → Solution → Early Adopter → FAQ → Footer
 */
export default function SalesPage() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <ProblemSection />
                <Features />
                <EarlyAdopterSection />
                <FAQSection />
            </main>
            <Footer />
        </>
    );
}
