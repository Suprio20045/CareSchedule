import { useState } from 'react';
import { signIn, signUp } from '../../utils/auth';

export default function AuthView() {
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password);

        setMessage(
          'Account created successfully!'
        );
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.25),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.22),transparent_30%),linear-gradient(135deg,#eef2ff_0%,#f8fafc_28%,#ecfeff_100%)] p-6 text-slate-900">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-8 top-12 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute bottom-12 right-12 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.5)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_32%,#0f766e_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.2em] text-cyan-100 uppercase">
                CareSchedule
              </div>
              <h1 className="mt-8 max-w-xs text-4xl font-black tracking-tight">
                Smarter care management for every family.
              </h1>
              <p className="mt-4 max-w-sm text-base text-slate-200">
                Track immunizations, stay ahead of reminders, and keep critical first-aid guidance close at hand.
              </p>
            </div>

            <div className="relative z-10 mt-8 space-y-4">
              {[
                'Unified patient timeline',
                'Proactive vaccination alerts',
                'Offline-ready care resources'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                    ✓
                  </span>
                  <span className="text-sm text-slate-100">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8 text-center lg:text-left">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#22d3ee,#a78bfa)] text-xl font-black text-white shadow-[0_20px_35px_-20px_rgba(168,85,247,0.8)] lg:mx-0">
                  ❤
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                  {isSignUp ? 'Create your account' : 'Welcome back'}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {isSignUp
                    ? 'Start managing care with confidence.'
                    : 'Sign in to continue your care dashboard.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[linear-gradient(135deg,#0f172a,#334155,#0f766e)] px-4 py-3.5 text-base font-semibold text-white shadow-[0_20px_35px_-20px_rgba(15,23,42,0.9)] transition-all duration-200 hover:translate-y-[-1px] hover:shadow-[0_25px_40px_-18px_rgba(15,118,110,0.75)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading
                    ? 'Please wait...'
                    : isSignUp
                    ? 'Create Account'
                    : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setMessage('');
                  }}
                  className="font-semibold text-violet-600 transition-colors hover:text-violet-700"
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Create one"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}