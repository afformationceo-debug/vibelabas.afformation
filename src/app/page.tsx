import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Products from '@/components/sections/Products';
import Proof from '@/components/sections/Proof';
import Traction from '@/components/sections/Traction';
import Vision from '@/components/sections/Vision';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Problem />
        <Products />
        <Proof />
        <Traction />
        <Vision />
      </main>
      <Footer />
    </>
  );
}
