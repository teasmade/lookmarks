import { api } from "~/trpc/server";
import BookmarkCard from "./BookmarkCard";
import type { Bookmark } from "@prisma/client";

export default async function BookmarkList({
  searchResults,
}: {
  searchResults: Bookmark[] | null;
}) {
  const sampleBookmarks = await api.bookmark.getNRandom({
    count: 24,
  });
  const currentBookmarks = searchResults ?? sampleBookmarks;
  return (
    <>
      {currentBookmarks.length ? (
        <div className="sm grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {currentBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      ) : null}
    </>
  );
}
