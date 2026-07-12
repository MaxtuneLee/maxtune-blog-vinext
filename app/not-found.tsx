import LinkButton from "@/components/LinkButton";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex max-w-3xl flex-1 items-center justify-center"
    >
      <div className="not-found-wrapper mb-14 flex flex-col items-center justify-center">
        <h1
          aria-label="404 Not Found"
          className="text-9xl font-bold text-skin-accent"
        >
          404
        </h1>
        <span aria-hidden="true">{"¯\\_(ツ)_/¯"}</span>
        <p className="mt-4 text-2xl sm:text-3xl">Page Not Found</p>
        <LinkButton
          href="/"
          className="my-6 text-lg underline decoration-dashed underline-offset-8"
        >
          回到主页
        </LinkButton>
      </div>
    </main>
  );
}
