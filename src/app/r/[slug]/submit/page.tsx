import { db } from "@/lib/db";
import Editor from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: { slug: string };
}
const page = async ({ params: { slug } }: pageProps) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
  });

  if (!subreddit) {
    notFound();
  }
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="border-b border-gray-200 pb-2">
        <div className="ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-600">
            Creat Post
          </h3>
          <p className="ml-2 mt-1 truncate text-gray-500"> in r/{slug}</p>
        </div>
      </div>

      <Editor subredditId={subreddit.id} />

      <div className="w-full flex justify-end">
        <Button type="submit" className="w-full" form="subreddit-post-form">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default page;
