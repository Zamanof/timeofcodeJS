'use client';

import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronDown } from "lucide-react";
import { Switch } from "@headlessui/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, Language, Category, Topic, Article, CodeExample } from './services/api';
import { cn } from "@/lib/utils";

const customStyle: React.CSSProperties = {
  background: 'transparent',
  margin: 0,
  padding: 0,
  border: 'none',
  fontSize: '18px',
  lineHeight: '1.5'
};

// Custom AccordionTrigger without built-in chevron
const CustomAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all",
        className
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
CustomAccordionTrigger.displayName = "CustomAccordionTrigger";

export const Desktop = (): JSX.Element => {
  const [enabled, setEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setIsDarkMode(enabled);
  }, [enabled]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const data = await api.languages.getAll();
        setLanguages(data);
        if (data.length > 0) {
          setSelectedLanguage(data[0]);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedLanguage) return;
      
      try {
        setLoading(true);
        const data = await api.categories.getByLanguage(selectedLanguage.id);
        setCategories(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchTopics = async (categoryId: number) => {
      try {
        const data = await api.topics.getByCategory(categoryId);
        return data;
      } catch (err) {
        console.error('Failed to fetch topics:', err);
        return [];
      }
    };

    const loadAllTopics = async () => {
      const allTopics = await Promise.all(
        categories.map(category => fetchTopics(category.id))
      );
      setTopics(allTopics.flat());
    };

    if (categories.length > 0) {
      loadAllTopics();
    } else {
      setTopics([]);
    }
  }, [categories]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!selectedTopic) return;
      
      try {
        setLoading(true);
        const data = await api.articles.getByTopic(selectedTopic.id);
        setArticles(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedTopic]);

  if (loading && languages.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error && languages.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen h-full bg-[#f7f7fa] dark:bg-[#1a1a1a] p-2.5">
      {/* Header */}
      <Card className="w-full mb-2 border border-black dark:border-white rounded-[10px]">
        <CardContent className="flex flex-col gap-4 p-4">
          {/* Top Row: Logo and Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left side: Logo and Languages Menu */}
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative h-[68px] w-[173px] min-w-[120px] flex-shrink-0 overflow-hidden rounded-[10px]">
                <div className="absolute inset-0 rounded-[10px] shadow-[inset_0_0_0_2px_black] dark:shadow-[inset_0_0_0_2px_white]" />
                <img
                  src="/TOC.svg"
                  alt="Logo"
                  className="w-full h-full object-cover filter dark:invert"
                />
              </div>

              {/* Programming Languages Menu */}
              <Tabs 
                value={selectedLanguage?.name.toLowerCase()} 
                className="w-full"
                onValueChange={(value) => {
                  const lang = languages.find(l => l.name.toLowerCase() === value);
                  if (lang) setSelectedLanguage(lang);
                }}
              >
                <TabsList className="bg-transparent shadow-none">
                  {languages.map((lang) => (
                    <TabsTrigger
                      key={lang.id}
                      value={lang.name.toLowerCase()}
                      className="bg-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white text-[#534e4e] dark:text-[#cccccc] hover:bg-transparent hover:shadow-none relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 data-[state=active]:after:scale-x-100 after:bg-black dark:after:bg-white after:transition-transform text-[16px]"
                    >
                      {lang.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Search and Theme Toggle */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#534e4e] dark:text-[#cccccc]" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-[300px] pl-9 border-[0.5px] border-black dark:border-white rounded-[10px] bg-transparent text-[18px] font-normal text-[#534e4e] dark:text-[#cccccc] placeholder:text-[#534e4e] dark:placeholder:text-[#cccccc]"
                />
              </div>
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className="relative inline-flex h-6 w-11 items-center rounded-full border border-black dark:border-white"
              >
                <span className="sr-only">Enable dark mode</span>
                <span
                  className={`${
                    enabled ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-black dark:bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Section */}
      <div className="flex flex-1 flex-col md:flex-row gap-2">
        {/* Left Sidebar */}
        <Card className="w-full md:w-[267px] shrink-0 border-[0.5px] border-black dark:border-white rounded-[10px]">
          <CardContent className="p-4">
            <Accordion type="multiple" className="space-y-4">
              {categories.map((category) => {
                const categoryTopics = topics.filter(t => t.categoryId === category.id);
                return (
                  <AccordionItem 
                    key={category.id} 
                    value={category.id.toString()} 
                    className="border-b-0 last:border-b-0 [&_svg]:rotate-180 [&_[data-state=open]_svg]:rotate-0"
                  >
                    <CustomAccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[18px] font-medium text-black dark:text-white">
                          {category.name}
                        </span>
                        <ChevronDown 
                          className="h-4 w-4 shrink-0 text-black dark:text-white transition-transform duration-200" 
                        />
                      </div>
                    </CustomAccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-4">
                        {categoryTopics.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic)}
                            className={`w-full text-left px-2 py-1 rounded-md text-[18px] ${
                              selectedTopic?.id === topic.id
                                ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white'
                                : 'text-[#534e4e] dark:text-[#cccccc] hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                          >
                            {topic.title}
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="flex-1 border-[0.5px] border-black dark:border-white rounded-[10px]">
          <CardContent className="p-4">
            <div className="w-full space-y-4">
              {selectedTopic ? (
                <div className="prose dark:prose-invert max-w-none">
                  <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
                    {selectedTopic.title}
                  </h1>
                  <p className="text-[18px] text-[#534e4e] dark:text-[#cccccc] mb-6">
                    {selectedTopic.description}
                  </p>
                  
                  {loading ? (
                    <div className="text-center py-4">Loading articles...</div>
                  ) : error ? (
                    <div className="text-red-500 py-4">Error: {error}</div>
                  ) : articles.length === 0 ? (
                    <div className="text-gray-500 py-4">No articles available for this topic</div>
                  ) : (
                    <div className="space-y-8">
                      {articles.map((article) => (
                        <div key={article.id} className="prose dark:prose-invert">
                          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
                            {article.title}
                          </h2>
                          <div className="text-[18px] text-[#534e4e] dark:text-[#cccccc] mb-4">
                            {article.content}
                          </div>
                          {article.codeExamples.map((example: CodeExample, index: number) => (
                            <div key={index} className="mb-4">
                              <p className="text-[18px] text-[#534e4e] dark:text-[#cccccc] mb-2">
                                {example.description}
                              </p>
                              <div className="inline-block min-w-fit rounded-lg !bg-black/5 dark:!bg-white/5 p-6">
                                <SyntaxHighlighter
                                  language={example.language}
                                  style={isDarkMode ? vscDarkPlus : vs}
                                  customStyle={customStyle}
                                  className="!bg-transparent !m-0 !p-0 !border-none [&>span]:!bg-transparent [&>*]:!text-[18px]"
                                  wrapLongLines={true}
                                  showLineNumbers={true}
                                  lineNumberStyle={{
                                    minWidth: '2.5em',
                                    paddingRight: '1em',
                                    textAlign: 'right',
                                    userSelect: 'none',
                                    opacity: 0.5,
                                    fontSize: '18px'
                                  }}
                                >
                                  {example.code}
                                </SyntaxHighlighter>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Select a topic to view its content
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Card className="w-full mt-2 border-[0.5px] border-black dark:border-white rounded-[10px]">
        <CardContent className="flex items-center justify-center p-4">
          <div className="flex items-center">
            <span className="font-normal text-black dark:text-white text-2xl">©</span>
            <span className="font-normal text-black dark:text-white text-[18px] ml-1">
              Nadir Zamanov 2024
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 