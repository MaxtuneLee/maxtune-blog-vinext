import LinkButton from "./LinkButton";
import socialIcons from "@/lib/social-icons";

const shareLinks = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: "Share this post via WhatsApp",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: "Share this post on Facebook",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/intent/tweet?url=",
    linkTitle: "Tweet this post",
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: "Share this post via Telegram",
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    linkTitle: "Share this post on Pinterest",
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: "Share this post via email",
  },
] as const;

export default function ShareLinks({ url }: { url: string }) {
  return (
    <div className="social-icons flex flex-col flex-wrap items-center justify-center gap-1 sm:items-start">
      <span className="italic">分享这篇文章到 ↓</span>
      <div className="text-center">
        {shareLinks.map(social => (
          <LinkButton
            key={social.name}
            href={social.href + url}
            className="link-button scale-90 p-2 hover:rotate-6 sm:p-1"
            title={social.linkTitle}
          >
            <span dangerouslySetInnerHTML={{ __html: socialIcons[social.name] }} />
            <span className="sr-only">{social.linkTitle}</span>
          </LinkButton>
        ))}
      </div>
    </div>
  );
}
