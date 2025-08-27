import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';

const AdminLogin = () => {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password);
    if (result.success) {
      toast.success('Logged in successfully!');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
          <div className="flex justify-center">
  <img className="h-12 w-auto" src="/logo.png" alt="Tec Consultancy" />
</div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            {
              isLoading ? (
                <div className="flex items-center justify-center w-full py-3 px-4 bg-primary-100 text-primary-600 rounded-lg">
                                <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                                    <span className='text-sm font-medium'>Loading, please wait...</span>
                              </div>
              ) : (
                <button
                disabled={isLoading}
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Sign in
                </button>
              )
            }
          
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

