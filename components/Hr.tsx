export default function Hr({
  noPadding = false,
  ariaHidden = true,
}: {
  noPadding?: boolean;
  ariaHidden?: boolean;
}) {
  return (
    <div className={`mx-auto max-w-3xl ${noPadding ? "px-0" : "px-4"}`}>
      <hr className="border-skin-line" aria-hidden={ariaHidden} />
    </div>
  );
}
