import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    });
    setSubmitting(false);
    if (error) {
      setError('Invalid email or password.');
      return;
    }
    navigate('/admin');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-50 px-4">
      <div className="flex items-center gap-2 mb-6">
        <span className="font-display font-extrabold text-ink text-lg">Success Enterprise</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
          Admin
        </span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 bg-white p-8 rounded-lg shadow-sm border border-neutral-200"
      >
        <h1 className="font-display text-xl font-bold text-ink">Sign in</h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-neutral-600">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border border-neutral-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-neutral-600">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="border border-neutral-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-neutral-900 text-white rounded-md p-2 text-sm font-medium hover:bg-neutral-800 disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
