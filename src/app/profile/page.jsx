'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [status, session, router]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully');
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (error) {
      setError('An error occurred while updating password');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="px-6 py-16 text-center text-ink-muted dark:text-white/60">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="eyebrow mb-3">Profile</p>
      <h1 className="font-serif text-3xl font-semibold text-ink dark:text-white">
        Profile settings
      </h1>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-900/20">
          <p className="text-emerald-700 dark:text-emerald-400">{success}</p>
        </div>
      )}

      <div className="card mt-8 p-6">
        <h2 className="font-serif text-lg font-semibold text-ink dark:text-white">Update Profile</h2>
        <form onSubmit={handleProfileUpdate} className="mt-5 space-y-4">
          <div>
            <label className="field-label">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field-input"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary">
            Update Profile
          </button>
        </form>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-serif text-lg font-semibold text-ink dark:text-white">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="mt-5 space-y-4">
          <div>
            <label className="field-label">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="field-input"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="field-label">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="field-input"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="field-label">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="field-input"
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
