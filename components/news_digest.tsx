"use client";
import { useState, useEffect } from "react";
import { TabsTrigger, Tabs, TabsContent, TabsList } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Story } from "@/app/server/news_fetch";
import { ExternalLink, ChevronDown, MessageSquare } from "lucide-react";

interface Props {
  newsDigestData: Record<string, Story[]>;
}

export default function NewsDigest({ newsDigestData: newsData }: Props) {
  const [activeSource, setActiveSource] = useState(Object.keys(newsData)[0]);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setExpandedCards(
      Object.fromEntries(
        Object.values(newsData).flatMap((articles) =>
          articles.map((article) => [article.id, isDesktop])
        )
      )
    );
  }, [isDesktop, newsData]);

  const toggleCard = (id: string) => {
    if (!isDesktop) {
      setExpandedCards((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl">
            News Digest
          </h1>
          <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
            Stay informed with the latest updates from trusted sources
          </p>
        </header>

        <Tabs
          value={activeSource}
          onValueChange={setActiveSource}
          className="space-y-6"
        >
          <div className="z-10 bg-neutral-50 dark:bg-neutral-900 pb-4">
            {/* Mobile Select Dropdown */}
            <div className="md:hidden w-full">
              <Select value={activeSource} onValueChange={setActiveSource}>
                <SelectTrigger className="w-full text-lg py-6 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                  {Object.keys(newsData).map((source) => (
                    <SelectItem
                      key={source}
                      value={source}
                      className="text-lg py-3 focus:bg-neutral-100 dark:focus:bg-neutral-700"
                    >
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:block border-b border-neutral-200 dark:border-neutral-700">
              <TabsList className="w-full h-auto p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-4">
                {Object.keys(newsData).map((source) => (
                  <TabsTrigger
                    key={source}
                    value={source}
                    className="flex-1 px-6 py-3 capitalize text-sm font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100"
                  >
                    {source}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {Object.entries(newsData).map(([source, articles]) => (
            <TabsContent key={source} value={source} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    className="bg-white dark:bg-neutral-800 transition-all duration-300 hover:shadow-lg dark:hover:shadow-neutral-700/30 border-neutral-200 dark:border-neutral-700 flex flex-col"
                  >
                    <CardHeader
                      className="pb-4 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleCard(article.id)}
                    >
                      <div className="space-y-2">
                        <CardTitle className="text-2xl leading-tight font-semibold text-neutral-900 dark:text-neutral-100">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="text-base text-neutral-500 dark:text-neutral-400">
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
                          >
                            Visit source
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </CardDescription>
                      </div>
                      {!isDesktop && (
                        <ChevronDown
                          className={`h-6 w-6 transition-transform ${
                            expandedCards[article.id]
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                        />
                      )}
                    </CardHeader>
                    {(expandedCards[article.id] || isDesktop) && (
                      <CardContent className="flex-grow space-y-6">
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                            Article Summary
                          </h3>
                          <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                            {article.summary}
                          </p>
                        </div>
                        {article.commentsSummary && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <MessageSquare className="h-4.5 w-4.5" />
                                Discussion Summary
                              </h3>
                              <a
                                href={article.commentsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
                              >
                                View discussion
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                            <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                              {article.commentsSummary}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
