import { SITE } from "@/lib/config";
import type { Post } from "@/lib/types";

const postFilter = ({ data }: Post) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return !data.draft && (process.env.NODE_ENV === "development" || isPublishTimePassed);
};

export default postFilter;
