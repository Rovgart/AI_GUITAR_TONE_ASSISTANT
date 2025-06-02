import Button from "@/atoms/button";
import { Box } from "@/atoms/container ";
import { Heading } from "@/atoms/typography";
import { Stack } from "@/atoms/ui-structures";
import { useUser } from "@/hooks/useUser";
interface User {
  id: number;
  email: string;
  username: string;
}
type UserPropsT = {
  user: User;
};
export default function UserProfile({ user }: UserPropsT) {
  const { logout } = useUser();
  const logoutHandler = () => {
    logout();
  };
  return (
    <Box padding="md">
      <Stack direction="col" justify="center" align="center">
        <Heading level={4} size="md">
          Hello, {user?.username}
        </Heading>
        <Button>Presets</Button>
        <Button onClick={logoutHandler} type="button">
          Logout
        </Button>
      </Stack>
    </Box>
  );
}
