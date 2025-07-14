import { useState } from 'react';
import logo from "../assets/logo_noslogan.png";
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '@/services/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  function handleLogoutClick() {
    handleLogout(navigate);
  }

  return (
    <nav className={`font-poppins bg-white md:text-sm border-b border-gray-200 transition-all duration-300 h-auto ${isOpen ? "shadow-lg rounded-xl mx-2 mt-2" : ""}`}>
      <div className="max-w-screen-xl mx-auto px-4 md:flex md:items-center md:justify-between">
        <div className="flex items-center justify-between md:py-3">
          <a href="#">
            <img src={logo} width={170} height={50} alt="Logo" />
          </a>
          <button className="menu-btn md:hidden text-gray-500 hover:text-gray-800" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
        <div className={`menu-content md:flex md:items-center md:space-x-6 ${isOpen ? "block" : "hidden"}`}>
          <ul className="mt-6 space-y-4 md:mt-0 md:flex md:space-y-0 md:space-x-6 font-poppins">
            {[{ title: "Features" }, { title: "Integrations" }, { title: "Customers" }, { title: "Pricing" }].map((item, idx) => (
              <li key={idx}>
                <a href="#" className="text-gray-700 hover:text-gray-900 block">{item.title}</a>
              </li>
            ))}
          </ul>
          <div className="mt-6 md:mt-0 md:flex md:items-center md:space-x-4 pb-5 md:pb-0">
            <button onClick={() => handleLogout(navigate)} className="inline-flex items-center gap-x-1 px-4 py-2 text-blue bg-yellow hover:bg-blue hover:text-yellow active:scale-90 rounded-full">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
