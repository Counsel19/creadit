import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subscriptionExist = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExist) {
      return new Response("You are not Subscibed to this subreddit", {
        status: 400,
      });
    } else {
      // Check if the user is the creator of this subreddit
      const subreddit = await db.subreddit.findFirst({
        where: {
          id: subredditId,
          creatorId: session.user.id,
        },
      });

      if (subreddit) {
        return new Response("You cannot uncsubscribe from your subreddit", {
          status: 400,
        });
      }

      await db.subscription.delete({
        where: {
          id: subscriptionExist.id,
        },
      });

      return new Response(subredditId);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("invalid Request Data", { status: 422 });
    }

    return new Response("Could not Unsubscribe, Please try again", {
      status: 500,
    });
  }
}
