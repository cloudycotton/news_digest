import NewsDigest from "@/components/news_digest";
import { fetchNewsSummary } from "./server/news_fetch";

export default async function Home() {
  const summary = await fetchNewsSummary();
  return <NewsDigest newsDigestData={summary} />;
}
