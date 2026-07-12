import LinkButton from "./LinkButton";
import { getDictionary, defaultLocale, type Locale } from "@/lib/i18n";

type Props = {
  currentPage: number;
  totalPages: number;
  prevUrl: string;
  nextUrl: string;
  lang?: Locale;
};

export default function Pagination({
  currentPage,
  totalPages,
  prevUrl,
  nextUrl,
  lang = defaultLocale,
}: Props) {
  if (totalPages <= 1) return null;
  const dict = getDictionary(lang);

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <nav
      className="pagination-wrapper mb-8 mt-auto flex justify-center"
      aria-label="Pagination"
    >
      <LinkButton
        disabled={isPrevDisabled}
        href={prevUrl}
        className={`mr-4 select-none ${
          isPrevDisabled
            ? "pointer-events-none select-none opacity-50 hover:text-skin-base group-hover:fill-skin-base"
            : ""
        }`}
        ariaLabel="Previous"
      >
        <svg className={isPrevDisabled ? "disabled-svg" : ""}>
          <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z" />
        </svg>
        {dict.pagination.prev}
      </LinkButton>

      {currentPage} / {totalPages}

      <LinkButton
        disabled={isNextDisabled}
        href={nextUrl}
        className={`ml-4 select-none ${
          isNextDisabled
            ? "pointer-events-none select-none opacity-50 hover:text-skin-base group-hover:fill-skin-base"
            : ""
        }`}
        ariaLabel="Next"
      >
        {dict.pagination.next}
        <svg className={isNextDisabled ? "disabled-svg" : ""}>
          <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z" />
        </svg>
      </LinkButton>
    </nav>
  );
}
