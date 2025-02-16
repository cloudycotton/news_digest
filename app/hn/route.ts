import { fetchNewsSummary } from "../server/news_fetch";

export const GET = async () => {
  const result = await fetchNewsSummary();
  return Response.json(result);
};
