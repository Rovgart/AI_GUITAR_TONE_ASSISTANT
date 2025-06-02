import Button from "@/atoms/button";
import { Box } from "@/atoms/container ";
import { Stack } from "@/atoms/ui-structures";
import { useUser } from "@/hooks/useUser";
import ButtonGroup from "@/molecules/ButtonGroup";
import FormField from "@/molecules/FormField";
import { registerFormSchema } from "@/schemas";
import useModalStore from "@/store/providers/modalStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
  });
  const { signUp } = useUser();
  const { close } = useModalStore();
  const onSubmit = (data) => {
    console.log(data);
    signUp(data);
    close();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box padding="lg">
        <Stack direction="col" justify="center" align="center">
          <FormField
            {...register("username")}
            id="username"
            type="text"
            placeholder="Username"
            error={errors.username && errors.username.message}
          />
          <FormField
            {...register("email")}
            id="email"
            type="text"
            placeholder="Email"
            error={errors.email && errors.email.message}
          />
          <FormField
            {...register("password")}
            id="password"
            type="password"
            placeholder="Password"
            error={errors.password && errors.password.message}
            className="border border-black-500"
          ></FormField>
          <FormField
            {...register("confirmPassword")}
            id="password"
            type="password"
            placeholder="Confirm Password"
            error={errors.confirmPassword && errors.confirmPassword.message}
          ></FormField>
          <ButtonGroup>
            <Button type="submit">Sign Up</Button>
            <Button onClick={close} variant="outline" type="button">
              Cancel
            </Button>
          </ButtonGroup>
        </Stack>
      </Box>
    </form>
  );
}
