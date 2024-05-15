import type { Bookmark } from "@prisma/client";

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  function displayUrl(url: string) {
    // Strip http(s), www and trailing / from URL
    const cleanUrl = url.replace(/(^\w+:|^)\/\//, "").replace("www.", "");
    // Get domain name
    const domain = cleanUrl.split("/")[0];
    const path = cleanUrl.split("/").slice(1).reverse();
    return { domain, path };
  }

  return (
    <>
      <div className="flex min-h-64 max-w-xl flex-col justify-between gap-2 rounded-xl bg-white/10 p-4 pt-6 hover:bg-white/20">
        <p
          className="break-words text-sm leading-5 first-letter:float-left first-letter:text-5xl first-letter:font-bold first-letter:capitalize first-letter:leading-9 first-letter:text-[hsl(280,100%,70%)]
        first-line:text-xl first-line:leading-5 first-line:tracking-wider first-line:text-slate-300"
        >
          {bookmark.title}
        </p>
        {/* <h3 className=" truncate text-lg font-bold">{bookmark.title}</h3> */}
        {/* <div className="text-xs">
          {bookmark.tags === "" ? "-" : bookmark.tags}
        </div>
        <div className="text-sm">{bookmark.categories}</div> */}
        <div className="pl-2">
          <ul>
            {displayUrl(bookmark.url).path.map(
              (path, index) =>
                path && (
                  <li key={index} className="truncate text-[0.7rem]">
                    <span className="pr-[2px] text-sm font-bold text-blue-500">
                      /
                    </span>
                    {path}
                  </li>
                ),
            )}
          </ul>
          <div className="-mt-1 truncate text-blue-500">
            <a
              href={bookmark.url}
              className="rounded text-sm font-bold transition-colors  duration-200  hover:text-base hover:text-blue-300 hover:underline focus:text-base focus:text-blue-300 focus:underline focus:outline-none
              "
            >
              .{displayUrl(bookmark.url).domain}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
