import Hr from "./Hr";
import Socials from "./Socials";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <Hr noPadding />
      <div className="footer-wrapper flex flex-col items-center justify-between py-6 sm:flex-row-reverse sm:py-4">
        <Socials centered />
        <div className="copyright-wrapper my-2 flex flex-col items-center whitespace-nowrap sm:flex-row">
          <span>Copyright &#169; {currentYear} MaxtuneLee</span>
          <span className="separator hidden sm:inline">&nbsp;|&nbsp;</span>
          <span>人生路漫漫 白鹭常相伴</span>
          <span className="separator hidden sm:inline">&nbsp;|&nbsp;</span>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
            粤ICP备2020104557号
          </a>
        </div>
      </div>
    </footer>
  );
}
