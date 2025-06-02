import GenerateForm from "@/organisms/GenerateForm";

import UnfoldedMenu from "@/organisms/UnfoldedMenu";
import MainPageTemplate from "@/template/mainpage-template";

export default function MainPage() {
  return (
    <MainPageTemplate>
      <UnfoldedMenu />
      <GenerateForm />
    </MainPageTemplate>
  );
}
