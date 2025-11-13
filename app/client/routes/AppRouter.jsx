import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>This is a placeholder home page.</p>
      <p>
        Try going to <Link to="/login">Login</Link>.
      </p>
    </div>
  );
}

function Login() {
  return (
    <div>
      <h2>Login Page</h2>
      <p>Frontend team: hook this up to the real LoginForm.</p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
