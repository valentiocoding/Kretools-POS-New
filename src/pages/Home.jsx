import React from 'react';
import Navbar from '../components/Navbar';
import BounceCards from '../components/BounceCards';
import logo from '../assets/logo.png';
import home1 from "../assets/home1.jpg"
import home2 from "../assets/home2.jpg"
import home3 from "../assets/home3.jpg"
import home4 from "../assets/home4.jpg"
import home5 from "../assets/home5.jpg"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Portofolio from './Portofolio';


import { useAuth } from '@/Context/AuthContext';

const Home = () => {
  // isValid? 
  const { isValid } = useAuth();


  const navigate = useNavigate()


  const images = [home1, home2,home3,home4,home5];
  const transformStyles = [
    "rotate(5deg) translate(-150px)",
    "rotate(0deg) translate(-70px)",
    "rotate(-5deg)",
    "rotate(5deg) translate(70px)",
    "rotate(-5deg) translate(150px)"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfdfb] to-[#e2ebf0] flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-7xl w-full items-center">

          {/* LEFT SIDE - TEXT */}
          <div className="text-center md:text-left space-y-6">
            <img
              src={logo}
              alt="KreTools Logo"
              className="w-24 sm:w-28 md:w-40 mx-auto md:mx-0 drop-shadow-lg"
            />

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight tracking-tight font-poppins">
              Empower Your Business <br />
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
                with KreTools
              </span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto md:mx-0">
              The all-in-one platform for business intelligence, logistics, and more. Smart tools, powerful results.
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-2">
              <button onClick={()=> navigate("/dashboard")} className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition">
                Get Started
              </button>
              <button className="w-full sm:w-auto px-6 py-3 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl">
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - ANIMATION */}
          <div className="relative flex justify-center md:justify-end w-full px-2 sm:px-4">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
              <BounceCards
                images={images}
                animationDelay={0.5}
                animationStagger={0.08}
                easeType="elastic.out(1, 0.5)"
                transformStyles={transformStyles}
                enableHover={true}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Portofolio */}
      <main>

        <Portofolio/>
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-200">
        &copy; {new Date().getFullYear()} KreTools. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
