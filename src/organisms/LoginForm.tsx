import Button from "@/atoms/button";
import { Box } from "@/atoms/container ";
import { Stack } from "@/atoms/ui-structures";
import { useUser } from "@/hooks/useUser";
import ButtonGroup from "@/molecules/ButtonGroup";
import FormField from "@/molecules/FormField";
import useModalStore from "@/store/providers/modalStore";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const { login, isLoggingIn, isAuthenticated } = useUser();
  const { close } = useModalStore();
  const onSubmit = (data) => {
    login(data);
    if (isAuthenticated) close();
  };
  const closeHandler = () => {
    close();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box padding="lg">
        <Stack direction="col" align="center" justify="center">
          <FormField
            placeholder="Email"
            {...register("email")}
            id="email"
            type="text"
          ></FormField>
          <FormField
            placeholder="Password"
            {...register("password")}
            id="password"
            type="password"
          ></FormField>
          <ButtonGroup>
            <Button disabled={isLoggingIn ? true : false} type="submit">
              {isLoggingIn ? "Loading..." : "Login"}
            </Button>
            <Button onClick={closeHandler} type="button">
              Cancel
            </Button>
          </ButtonGroup>
        </Stack>
      </Box>
    </form>
  );
}
