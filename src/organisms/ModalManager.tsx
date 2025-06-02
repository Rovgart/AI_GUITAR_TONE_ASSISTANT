import useModalStore from "@/store/providers/modalStore";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";

export default function ModalManager() {
  const { modalType } = useModalStore();

  const modals = {
    "sign-up": <SignUpModal />,
    login: <LoginModal />,
  };

  const ModalComponent = modals[modalType] || null;

  return ModalComponent;
}
