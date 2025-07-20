import React, { useState, useEffect } from 'react';
import { loginWithEmail } from '../services/auth';
import { useAuth } from '@/Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Squares from '../components/Squares';
import SpotlightCard from '../components/SpotlightCard';
import ShinyText from '../components/ShinyText';
import InputWithIcon from '../components/InputWithIcon';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo_noslogan.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsValid, isValid, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isValid) {
      navigate('/');
    }
  }, [isValid, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await loginWithEmail(email, password);
    if (error) {
      alert(`Login gagal: ${error.message}`);
    } else {
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    }
  };

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden">
      <Squares
        direction="diagonal"
        speed={0.5}
        borderColor="#555"
        squareSize={30}
        hoverFillColor="#ffffff11"
      />

      <div className="absolute inset-0 flex items-center justify-center text-white z-10 px-4">
        <SpotlightCard className="font-poppins w-full max-w-sm sm:max-w-md p-6 sm:p-8">
          <img
            src={logo}
            alt="Logo"
            className="w-32 sm:w-40 mx-auto mb-4"
          />
          <div className="font-semibold flex flex-col space-y-4 items-center justify-center text-center">
            <ShinyText text="Login" className="text-xl sm:text-2xl" speed={1} />

            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-4 w-full items-center"
            >
              <InputWithIcon
                type="email"
                placeholder="Enter your email"
                icon={<EnvelopeIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputWithIcon
                type="password"
                placeholder="Enter your password"
                icon={<LockClosedIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full sm:w-[50%] py-2 text-sm sm:text-base text-gray-500 bg-transparent outline-none border shadow-sm rounded-lg active:scale-95 transition"
              >
                Login
              </button>
            </form>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default Login;
