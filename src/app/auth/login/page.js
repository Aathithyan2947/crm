'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';
import logo from '../../../../public/logo.svg';
import { initiateLogin, verifyAuth, resetPassword } from '@/services/auth-api';
import Image from 'next/image';
import { Eye, EyeOffIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [step, setStep] = useState('email'); // 'email' | 'auth'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isVerified, setIsVerified] = useState(null); // null | true | false
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center py-5'>
          <Image
            src={logo}
            alt='Logo'
            width={200}
            height={40}
            className='mx-auto transition-all duration-300'
          />
        </CardHeader>

        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className='space-y-5'>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder='Email'
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className='w-full'
              >
                {loading ? 'Checking...' : 'Next'}
              </Button>
            </form>
          )}

          {step === 'auth' && (
            <form
              onSubmit={
                isVerified ? handlePasswordSubmit : handleSetPasswordSubmit
              }
              className='space-y-5'
            >
              <div className="space-y-2">
                <Label htmlFor="email-display">Email</Label>
                <Input
                  id="email-display"
                  type='email'
                  value={email}
                  disabled
                  className='bg-muted cursor-not-allowed'
                />
              </div>

              {isVerified ? (
                <>
                  <div className='relative space-y-2'>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        required
                        className='pr-10'
                      />
                      <Button
                        type='button'
                        variant="ghost"
                        size="icon"
                        className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type='submit'
                    disabled={loading}
                    className='w-full'
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                  <Button
                    type='button'
                    variant="link"
                    onClick={handleResetPassword}
                    disabled={resetting}
                    className='w-full'
                  >
                    {resetting ? 'Sending...' : 'Forgot Password?'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="temp-password">Temp Password</Label>
                    <Input
                      id="temp-password"
                      type='text'
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      placeholder='Temporary password'
                      required
                    />
                  </div>
                  <div className='relative space-y-2'>
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder='New password'
                        required
                        className='pr-10'
                      />
                      <Button
                        type='button'
                        variant="ghost"
                        size="icon"
                        className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOffIcon size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type='submit'
                    disabled={loading}
                    className='w-full'
                  >
                    {loading ? 'Submitting...' : 'Set Password & Login'}
                  </Button>
                </>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}