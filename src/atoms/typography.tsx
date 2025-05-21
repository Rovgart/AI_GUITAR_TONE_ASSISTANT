import clsx from "clsx";
import React from "react";

type HeadingLevelT = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingPropsT extends React.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevelT;
  children?: React.ReactNode;
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

interface ParagraphPropsT extends React.HTMLAttributes<HTMLParagraphElement> {
  size: HeadingPropsT["size"];
  children?: React.ReactNode;
}

export const Heading = ({ level, children, size, ...props }: HeadingPropsT) => {
  const baseHeadingClass = "text-base text-white font-semibold";
  const headingSizes = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  };

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={clsx(baseHeadingClass, headingSizes[size])} {...props}>
      {children}
    </Tag>
  );
};

export const Paragraph = ({ size, children, ...props }: ParagraphPropsT) => {
  const paragraphBaseClass = "font-normal text-white";
  const paragraphSizes = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  };

  return (
    <p className={clsx(paragraphBaseClass, paragraphSizes[size])} {...props}>
      {children}
    </p>
  );
};
