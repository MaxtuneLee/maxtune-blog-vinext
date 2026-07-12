import Hr from "./Hr";
import Socials from "./Socials";
import { getDictionary, type Locale } from "@/lib/i18n";

export default function Footer({ lang }: { lang: Locale }) {
  const currentYear = new Date().getFullYear();
  const dict = getDictionary(lang);

  return (
    <footer className="mt-auto">
      <Hr noPadding />
      <div className="footer-wrapper flex flex-col items-center justify-between py-6 sm:flex-row-reverse sm:py-4">
        <Socials centered />
        <div className="copyright-wrapper my-2 flex flex-col items-center whitespace-nowrap sm:flex-row">
          <span>Copyright &#169; {currentYear} MaxtuneLee</span>
          <span className="separator hidden sm:inline">&nbsp;|&nbsp;</span>
          <span>{dict.footer.motto}</span>
          <span className="separator hidden sm:inline">&nbsp;|&nbsp;</span>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
            粤ICP备2020104557号
          </a>
        </div>
      </div>
    </footer>
  );
}
