import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Info from '../components/Info';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Gallery />
      <About />
      <Info />
      <Contact />
      <Footer />
    </>
  );
};

export default HomePage;