import type { PostData } from "@/lib/types";
import Datetime from "./Datetime";
import PostLink from "./PostLink";
import { toViewTransitionName } from "@/lib/utils/slugify";

type Props = {
  href?: string;
  frontmatter: PostData;
  secHeading?: boolean;
};

const linkClassName =
  "inline-block text-lg font-bold text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0";
const headingClassName = "text-lg font-medium decoration-dashed hover:underline";

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description } = frontmatter;
  const headingStyle = { viewTransitionName: toViewTransitionName(title) };

  return (
    <li className="my-8 flex flex-col gap-2">
      {href ? (
        <PostLink
          href={href}
          className={linkClassName}
          headingTag={secHeading ? "h2" : "h3"}
          headingClassName={headingClassName}
          headingStyle={headingStyle}
        >
          {title}
        </PostLink>
      ) : secHeading ? (
        <h2 className={headingClassName} style={headingStyle}>{title}</h2>
      ) : (
        <h3 className={headingClassName} style={headingStyle}>{title}</h3>
      )}
      <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
      <p>{description}</p>
    </li>
  );
}
