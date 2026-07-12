import Breadcrumbs from "./Breadcrumbs";

type Props = {
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
};

export default function Main({ title, description, children }: Props) {
  return (
    <>
      <Breadcrumbs />
      <main id="main-content" className="mx-auto w-full max-w-3xl px-4 pb-4">
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description && <p className="mb-6 mt-2 italic">{description}</p>}
        {children}
      </main>
    </>
  );
}
