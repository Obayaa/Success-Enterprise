import { signIn } from '@/auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <form
        action={async (formData) => {
          'use server';
          await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirectTo: '/admin',
          });
        }}
        className="w-full max-w-sm flex flex-col gap-4 bg-white p-8 rounded-lg shadow-sm border border-neutral-200"
      >
        <h1 className="text-xl font-semibold text-neutral-900">Admin Login</h1>
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
        <button
          type="submit"
          className="bg-neutral-900 text-white rounded-md p-2 text-sm font-medium hover:bg-neutral-800"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
