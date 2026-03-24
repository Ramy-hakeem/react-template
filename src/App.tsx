import { useLogin } from './api/Authentication';
import { Button } from './components/ui/button';

const RequestData = {
  userName: 'admin',
  password: '123456',
  deviceId: 'postman',
  forceLogin: false,
};
export default function App() {
  const login = useLogin();
  return (
    <>
      <Button
        onClick={() => {
          login.mutateAsync(RequestData);
        }}
      >
        Login
      </Button>
    </>
  );
}
