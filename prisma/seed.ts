import { JSDOM } from "jsdom";
import { db } from "../src/server/db";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

interface Bookmark {
  id: number;
  url: string;
  title: string;
  tags: string | null;
  addDate: string;
  categories: string | null;
}

// Resolve the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parses the bookmarks HTML and returns an array of bookmarks with categories
function parseBookmarks(htmlString: string): Bookmark[] {
  const dom = new JSDOM(htmlString);
  const doc = dom.window.document;
  const bookmarks: Bookmark[] = [];
  let id = 1;

  function parseElement(element: Element, currentPath: string[] = []): void {
    Array.from(element.children).forEach((child) => {
      if (child.tagName === "DT" && child.querySelector("H3")) {
        const categoryName = child.querySelector("H3")!.textContent!;
        const newPath = [...currentPath, categoryName];

        const nestedDL = child.querySelector("DL");
        if (nestedDL) {
          parseElement(nestedDL, newPath);
        }
      } else if (child.tagName === "DT" && child.querySelector("A")) {
        const linkElement = child.querySelector("A")!;
        bookmarks.push({
          id: id,
          url: linkElement.getAttribute("HREF")!,
          title: linkElement.textContent!,
          tags: linkElement.getAttribute("TAGS"),
          addDate: linkElement.getAttribute("ADD_DATE")!,
          categories: currentPath.join(),
        });
        id++;
      } else if (child.tagName === "DT") {
        parseElement(child, currentPath);
      }
    });
  }

  const rootDL = doc.querySelector("DL");
  if (rootDL) {
    parseElement(rootDL);
  }

  return bookmarks;
}

async function main() {
  const bookmarksHtml = fs.readFileSync(
    path.resolve(__dirname, "./seed_data/bookmarks.html"),
    "utf-8",
  );
  const parsedBookmarks = parseBookmarks(bookmarksHtml);
  for (const bookmark of parsedBookmarks) {
    await db.bookmark.create({
      data: {
        url: bookmark.url,
        title: bookmark.title,
        tags: bookmark.tags,
        addDate: bookmark.addDate,
        categories: bookmark.categories,
      },
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
