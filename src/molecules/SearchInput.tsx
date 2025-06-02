import FormField from "./FormField";
import { useEffect, type ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

interface SearchInputProps {
  id: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  isOpen: boolean;
  choice: string;
  registerFieldName: string;
}

export default function SearchInput({
  id,
  placeholder,
  onSearch,

  choice,
  registerFieldName,
}: SearchInputProps) {
  const { register, setValue } = useFormContext();

  const valueChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value);
    onSearch(value);
  };
  useEffect(() => {
    if (choice !== undefined) {
      setValue(registerFieldName, choice);
    }
  }, [choice, setValue, registerFieldName]);

  return <FormField id={id} type="text" placeholder={placeholder} />;
}
