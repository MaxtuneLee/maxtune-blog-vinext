import { LOCALE } from "@/lib/config";

type Props = {
  pubDatetime: string | Date;
  modDatetime?: string | Date | null;
  size?: "sm" | "lg";
  className?: string;
};

function FormattedDatetime({
  pubDatetime,
  modDatetime,
}: {
  pubDatetime: string | Date;
  modDatetime?: string | Date | null;
}) {
  const myDatetime = new Date(modDatetime || pubDatetime);

  const date = myDatetime.toLocaleDateString(LOCALE.langTag, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const time = myDatetime.toLocaleTimeString(LOCALE.langTag, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <time dateTime={myDatetime.toISOString()}>
      {date}
      <span aria-hidden="true"> | </span>
      <span className="sr-only">&nbsp;at&nbsp;</span>
      <span className="text-nowrap">{time}</span>
    </time>
  );
}

export default function Datetime({
  pubDatetime,
  modDatetime,
  size = "sm",
  className,
}: Props) {
  return (
    <div className={`flex items-center space-x-2 opacity-80 ${className ?? ""}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={`${size === "sm" ? "scale-90" : "scale-100"} inline-block h-6 w-6 min-w-[1.375rem] fill-skin-base opacity-70`}
      >
        <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z" />
        <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z" />
      </svg>
      {modDatetime ? (
        <span className={size === "sm" ? "text-sm" : "text-base"}>更新于：</span>
      ) : (
        <span className="sr-only">发布于：</span>
      )}
      <span className={size === "sm" ? "text-sm" : "text-base"}>
        <FormattedDatetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
      </span>
    </div>
  );
}
