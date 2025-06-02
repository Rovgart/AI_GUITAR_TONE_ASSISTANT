export default function MainPageTemplate({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-secondary grid md:grid-cols-[1fr_3fr] grid-cols-1 h-screen">
      {children}
    </div>
  );
}
