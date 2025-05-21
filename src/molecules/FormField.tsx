import { forwardRef } from "react";
import Input from "@/atoms/Input";
import { Paragraph } from "@/atoms/typography";
import Box from "@/atoms/box";
import Label from "@/atoms/label";

interface FormFieldPropsT {
  label?: string;
  id: string;
  type?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  helperText?: string;
  variant: InputVariantsT;
  placeholder?: string;
  name?: string;
  className?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldPropsT>(
  (
    {
      label,
      id,
      type = "text",
      name,
      value,
      onChange,
      placeholder,
      error,
      helperText,
      variant,
      className,
    },
    ref
  ) => {
    return (
      <Box className={className}>
        {label && <Label variant="subtle" text={label} htmlFor={id} />}
        <Input
          className="w-full"
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          variant={variant}
          placeholder={placeholder}
        />
        {helperText && (
          <Paragraph className="text-gray-500" size="sm" variant="default">
            {helperText}
          </Paragraph>
        )}
        {error && (
          <Paragraph className="text-red-500" size="sm" variant="default">
            {error}
          </Paragraph>
        )}
      </Box>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
