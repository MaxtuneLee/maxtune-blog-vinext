import Main from "@/components/Main";
import friendsData from "@/content/friends.json";
import Image from "next/image";
import { getDictionary, type Locale } from "@/lib/i18n";

type Friend = {
  name: string;
  url: string;
  bio: string;
  avatar?: string;
};

const friends = friendsData as Friend[];

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: getDictionary(lang).friends.metaTitle };
}

export default async function FriendsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <Main title={dict.friends.pageTitle}>
      <ul className="grid-col-1 grid gap-6 pb-4 md:grid-cols-2 mt-4">
        {friends.map(friend => (
          <li
            key={friend.name}
            className="relative cursor-pointer p-6 transition-all duration-300 hover:bg-skin-accent/10"
          >
            <a
              href={friend.url}
              target="_blank"
              rel="noreferrer"
              aria-label={friend.name}
              className="absolute inset-0"
            />
            <div className="mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-skin-accent/10 shadow-inner">
              {friend.avatar ? (
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="h-full w-full rounded-full object-cover shadow-inner"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-skin-accent/60"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx={12} cy={7} r={4} />
                </svg>
              )}
            </div>
            <span className="inline-block text-lg font-bold text-skin-accent decoration-dashed underline-offset-4">
              {friend.name}
            </span>
            <p className="opacity-80">{friend.bio}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="transparent"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-4 top-4 h-6 w-6 text-skin-accent"
            >
              <path d="M7 7h10v10" fill="transparent" />
              <path d="M7 17 17 7" />
            </svg>
          </li>
        ))}
        <li className="flex cursor-pointer flex-col justify-center bg-skin-accent/5 p-6 transition-all duration-300 hover:bg-skin-accent/10">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-skin-accent/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-skin-accent"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </div>
          <a
            href="mailto:max@xox.im"
            className="inline-block text-lg font-bold text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
          >
            {dict.friends.addFriendCta}
          </a>
          <p className="text-base font-[300] opacity-80">{dict.friends.addFriendHint}</p>
        </li>
      </ul>
    </Main>
  );
}
