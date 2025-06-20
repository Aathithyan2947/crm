'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';
import logo from '../../../../public/logo.svg';
import { initiateLogin, verifyAuth, resetPassword } from '@/services/auth-api';
import Image from 'next/image';

export default function LoginPage() {
  const [step, setStep] = useState('email'); // 'email' | 'auth'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isVerified, setIsVerified] = useState(null); // null | true | false
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const router = useRouter();
  const { login, token } = useAuth();

  useEffect(() => {
    if (token) {
      router.replace('/dashboard/employees');
    }
  }, [token, router]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await initiateLogin({ email });
      const { is_verified } = response.data.data;

      setIsVerified(is_verified);
      setStep('auth');
    } catch (err) {
      toast.error('Email not found or invalid!');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await verifyAuth({ email, password });
      const { token, user } = response.data.data;

      login(user, token);
      toast.success('Logged in successfully!');
      router.push('/dashboard/employees');
    } catch (err) {
      toast.error('Invalid credentials!');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await verifyAuth({
        email,
        temp_password: tempPassword,
        new_password: newPassword,
      });
      const { token, user } = response.data.data;

      login(user, token);
      toast.success('Password set successfully!');
      router.push('/dashboard/employees');
    } catch (err) {
      toast.error('Verification failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetting(true);
    try {
      const response = await resetPassword({ email });
      const { message, temp_password } = response.data.data;

      toast.success(message || 'Temporary password sent!');
      setTempPassword(temp_password);
      setNewPassword('');
      setIsVerified(false); // force show temp password + new password fields
    } catch (err) {
      toast.error('Failed to reset password!');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className='h-screen w-screen flex items-center justify-center bg-lightPurple'>
      <div className='bg-white p-8 rounded-xl shadow-xl w-full max-w-md'>
        <div className='py-5 flex justify-center'>
          <Image
            src={logo}
            alt='Logo'
            width={200}
            height={40}
            className='transition-all duration-300'
          />
        </div>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm'
                placeholder='Email'
              />
            </div>
            <button
              disabled={loading}
              className='w-full py-3 rounded-xl font-semibold bg-deepViolet hover:scale-105 transition-all text-white'
            >
              {loading ? 'Checking...' : 'Next'}
            </button>
          </form>
        )}

        {step === 'auth' && (
          <form
            onSubmit={
              isVerified ? handlePasswordSubmit : handleSetPasswordSubmit
            }
            className='space-y-5'
          >
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <input
                type='email'
                value={email}
                disabled
                className='w-full border border-gray-300 bg-gray-100 rounded-xl px-4 py-3 text-sm cursor-not-allowed'
              />
            </div>

            {isVerified ? (
              <>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Password
                  </label>
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    required
                    className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm'
                  />
                </div>
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full py-3 rounded-xl font-semibold bg-indigo-500 text-white'
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <button
                  type='button'
                  onClick={handleResetPassword}
                  disabled={resetting}
                  className='text-sm text-blue-600 underline mt-2'
                >
                  {resetting ? 'Sending...' : 'Forgot Password?'}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Temp Password
                  </label>
                  <input
                    type='text'
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder='Temporary password'
                    required
                    className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    New Password
                  </label>
                  <input
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='New password'
                    required
                    className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm'
                  />
                </div>
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full py-3 rounded-xl font-semibold bg-indigo-500 text-white'
                >
                  {loading ? 'Submitting...' : 'Set Password & Login'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
