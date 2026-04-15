import { Button } from '@/components/ui/button';
import { useGetCurrentUser } from '@/features/auth/api';

export default function Profile() {
  const { mutate: fetchProfile, isPending: isLoading } = useGetCurrentUser();
  return (
    <div className="flex justify-center items-center">
      <Button
        size="lg"
        onClick={() => fetchProfile()}
        disabled={isLoading}
        className="w-48 h-12 text-base font-semibold"
      >
        {isLoading ? 'Loading...' : 'Get Profile Data'}
      </Button>
    </div>
  );
}
