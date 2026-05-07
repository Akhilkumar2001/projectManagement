import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice.js';
import logo from '../assets/logo.svg';

export default function Login() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => { if (token) navigate('/'); }, [token, navigate]);
  useEffect(() => { return () => dispatch(clearError()); }, [dispatch]);

  const onSubmit = (data) => dispatch(login(data));

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="card w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="ProjectFlow" className="h-9" />
        </div>

        <h1 className="text-xl font-semibold text-center mb-1" style={{ color: 'var(--color-text)' }}>
          Welcome back
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Sign in to your account
        </p>

        {error && (
          <div
            className="mb-4 px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--color-danger)', color: '#fff', borderRadius: 'var(--radius-brand)' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="you@company.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full py-2.5 mt-2" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
