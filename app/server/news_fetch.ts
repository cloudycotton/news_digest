import "server-only";
import { JSDOM } from "jsdom";

export interface Story {
  id: string;
  source: string;
  title: string;
  originalTitle?: string;
  link: string;
  domain: string;
  archiveLink: string;
  summary?: string;
  commentsLink?: string;
  commentsSummary?: string;
}

// We'll modify the return type to be a simple object mapping section names to story arrays.
function parseHTML(htmlString: string): Record<string, Story[]> {
  const dom = new JSDOM(htmlString);
  const doc = dom.window.document;

  const sourceSections: Record<string, Story[]> = {}; // Use a record for the tree structure

  const sourceSectionElements = doc.querySelectorAll(".source-section");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceSectionElements.forEach((sourceSectionElement: any) => {
    const sectionName =
      sourceSectionElement.querySelector("h2")?.textContent?.trim() || "";
    const normalizedSectionName = sectionName.toLowerCase().replace(/\s+/g, ""); // Normalize for consistency

    const stories: Story[] = [];
    const storyElements = sourceSectionElement.querySelectorAll(".story");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storyElements.forEach((storyElement: any) => {
      const storyId = storyElement.id;
      const titleElement = storyElement.querySelector(".title a");
      const title = titleElement ? titleElement.textContent?.trim() || "" : "";
      const link = titleElement ? titleElement.href : "";
      const domain =
        storyElement.querySelector(".domain")?.textContent?.trim() || "";
      const archiveLinkElement = storyElement.querySelector(".archive-link");
      const archiveLink = archiveLinkElement ? archiveLinkElement.href : "";
      const originalTitleElement =
        storyElement.querySelector(".original-title");
      const originalTitle = originalTitleElement
        ? originalTitleElement.textContent
            ?.replace(/^Original title: /, "")
            .trim()
        : undefined;
      const summaryElement = storyElement.querySelector(".summary");
      const summary = summaryElement
        ? summaryElement.textContent?.trim()
        : undefined;
      const commentsLinkElement = storyElement.querySelector(
        '.summary a[href*="item?id="]'
      );
      const commentsLink = commentsLinkElement
        ? commentsLinkElement.href
        : undefined;
      const commentsSummaryElement = storyElement.querySelector(
        '.summary a[href*="item?id="]'
      )?.parentElement;
      const commentsSummary = commentsSummaryElement
        ? commentsSummaryElement.textContent?.replace(/^Comments:/, "").trim()
        : undefined;

      const sourceBadgeElement = storyElement.querySelector(".source-badge");
      const source = sourceBadgeElement?.textContent?.trim() || "";

      stories.push({
        id: storyId,
        source,
        title,
        originalTitle,
        link,
        domain,
        archiveLink,
        summary,
        commentsLink,
        commentsSummary,
      });
    });

    // Instead of pushing a SourceSection, directly assign the stories array to the section name.
    sourceSections[normalizedSectionName] = stories;
  });

  return sourceSections;
}

export const fetchNewsSummary = async () => {
  const result = await fetch("https://hackyournews.com/");
  const html = await result.text();
  const parsed = parseHTML(html);
  return parsed;
};
