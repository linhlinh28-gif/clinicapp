import LoginForm from '../../LoginForm';

export default function LoginPage({ me, setMe }) {
  if (me) {
    return <p>You are already logged in.</p>;
  }
  return (
    <div>
      <h2>Login</h2>
      <LoginForm onLogin={setMe} />
    </div>
  );
}
