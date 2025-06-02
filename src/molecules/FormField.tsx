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
  placeholder?: string;
  name?: string;
  required?: boolean;
  className?: string;
  register?: any;
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
      required = false,
      className,
    },
    ref
  ) => {
    return (
      <Box className={className}>
        {label && <Label variant="subtle" text={label} htmlFor={id} />}
        <Input
          className="w-full "
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          required={required}
          onChange={onChange}
          variant={variant}
          placeholder={placeholder}
        />
        {helperText && (
          <Paragraph className="text-gray-500" size="sm">
            {helperText}
          </Paragraph>
        )}
        {error && (
          <Paragraph className="text-red-500" size="sm">
            {error}
          </Paragraph>
        )}
      </Box>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
