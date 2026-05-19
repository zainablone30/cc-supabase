import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    if (!email || !password) {
      setMessage('Email and password are required.');
      setLoading(false);
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Check your email for confirmation.');
      }
    }

    setLoading(false);
  };

  const handleToggle = () => {
    setIsLogin((prev) => !prev);
    setMessage('');
    setPassword('');
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Your password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      {message && <p className="auth-message">{message}</p>}
      <button type="button" className="toggle-btn" onClick={handleToggle}>
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
      </button>
    </div>
  );
}

export default Auth;
