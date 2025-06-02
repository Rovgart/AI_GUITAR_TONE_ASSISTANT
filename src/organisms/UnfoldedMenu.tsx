import Button from "@/atoms/button";
import { Box } from "@/atoms/container ";
import { Stack } from "@/atoms/ui-structures";
import { useUser } from "@/hooks/useUser";
import useModalStore from "@/store/providers/modalStore";
import { useMediaQuery } from "react-responsive";
import UserProfile from "./UserProfile";
export default function UnfoldedMenu() {
  const { open } = useModalStore();
  const { isAuthenticated, user } = useUser();
  const openSignUpHandler = () => {
    console.log("Clicked");
    open("sign-up");
  };
  const openLoginModalHandler = () => {
    open("login");
  };
  const isMobile = useMediaQuery({
    minWidth: "768px",
  });
  return (
    <Box className="  bg-secondary-400 min-w-3xs  z-10" padding="lg">
      {isAuthenticated ? (
        <UserProfile user={user} />
      ) : (
        <Stack direction={isMobile ? "col" : "row"} justify="center">
          <Button variant="outline" onClick={openSignUpHandler}>
            Sign Up
          </Button>
          <Button onClick={openLoginModalHandler} variant="outline">
            Sign In
          </Button>
        </Stack>
      )}
    </Box>
  );
}
