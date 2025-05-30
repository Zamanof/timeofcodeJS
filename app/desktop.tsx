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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { CodeProps } from 'react-markdown/lib/ast-to-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        "flex flex-1 items-center justify-between py-1 font-medium transition-all",
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
      if (!selectedLanguage?._id) return;
      
      try {
        setLoading(true);
        console.log('Fetching categories for language:', selectedLanguage._id);
        const data = await api.categories.getByLanguage(selectedLanguage._id);
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchTopics = async (categoryId: string) => {
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
        categories.map(category => fetchTopics(category._id || ''))
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
      if (!selectedTopic?._id) return;
      
      try {
        setLoading(true);
        const data = await api.articles.getByTopic(selectedTopic._id);
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
    <div className="flex flex-col min-h-screen h-full bg-[#f7f7fa] dark:bg-[#131516] p-2.5">
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

              {/* Programming Languages Menu - Desktop */}
              <div className="hidden sm:block">
                <Tabs
                  value={selectedLanguage?.name.toLowerCase() || languages[0]?.name.toLowerCase()} 
                  className="w-full"
                  onValueChange={(value) => {
                    const lang = languages.find(l => l.name.toLowerCase() === value);
                    if (lang) {
                      setSelectedTopic(null);
                      console.log('Selected language:', lang);
                      setSelectedLanguage(lang);
                    }
                  }}
                >
                  <TabsList className="bg-transparent shadow-none">
                    {languages.map((lang) => (
                      <TabsTrigger
                        key={lang._id}
                        value={lang.name.toLowerCase()}
                        className="bg-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white text-[#534e4e] dark:text-[#76a3ad] hover:bg-transparent hover:shadow-none relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 data-[state=active]:after:scale-x-100 after:bg-black dark:after:bg-white after:transition-transform text-[21px]"
                      >
                        {lang.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Programming Languages Menu - Mobile */}
              <div className="block sm:hidden w-full">
                <Select
                  value={selectedLanguage?.name.toLowerCase() || languages[0]?.name.toLowerCase()}
                  onValueChange={(value) => {
                    const lang = languages.find(l => l.name.toLowerCase() === value);
                    if (lang) {
                      setSelectedTopic(null);
                      console.log('Selected language:', lang);
                      setSelectedLanguage(lang);
                    }
                  }}
                >
                  <SelectTrigger className="w-full min-h-[45px] text-base border-[0.5px] border-black dark:border-white rounded-[10px] bg-transparent">
                    <SelectValue placeholder="Select Language">
                      {selectedLanguage?.name || languages[0]?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {languages.map((lang) => (
                      <SelectItem 
                        key={lang._id} 
                        value={lang.name.toLowerCase()}
                        className="min-h-[40px] text-base py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search and Theme Toggle */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#534e4e] dark:text-[#76a3ad]" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full sm:w-[200px] md:w-[250px] lg:w-[300px] pl-9 border-[0.5px] border-black dark:border-white rounded-[10px] bg-transparent text-[18px] font-normal text-[#534e4e] dark:text-[#76a3ad] placeholder:text-[#534e4e] dark:placeholder:text-[#76a3ad]"
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
      <div className="flex flex-col md:flex-row gap-2 flex-1">
        {/* Left Sidebar - Mobile Dropdown */}
        <div className="block md:hidden mb-2">
          <Select
            value={selectedTopic?._id || ''}
            onValueChange={(value) => {
              const topic = topics.find(t => t._id === value);
              if (topic) {
                setSelectedTopic(topic);
              }
            }}
          >
            <SelectTrigger className="w-full min-h-[45px] text-base border-[0.5px] border-black dark:border-white rounded-[10px] bg-transparent">
              <SelectValue placeholder="Select Topic">
                {selectedTopic?.title || 'Select a topic'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-full max-h-[50vh] overflow-y-auto">
              {categories.map((category) => {
                const categoryTopics = topics.filter(topic => topic.categoryId === category._id);
                return (
                  <React.Fragment key={category._id}>
                    <SelectItem 
                      value={category._id || ''}
                      className="font-semibold min-h-[40px] text-base py-2 cursor-default bg-gray-50 dark:bg-gray-800"
                      disabled
                    >
                      {category.name}
                    </SelectItem>
                    {categoryTopics.map(topic => (
                      <SelectItem 
                        key={topic._id}
                        value={topic._id || ''}
                        className="pl-6 min-h-[40px] text-base py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {topic.title}
                      </SelectItem>
                    ))}
                  </React.Fragment>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Left Sidebar - Desktop */}
        <Card className="hidden md:block w-full md:w-[267px] shrink-0 border-[0.5px] border-black dark:border-white rounded-[10px]">
          <CardContent className="p-4">
            <Accordion type="multiple" className="space-y-1">
              {categories.map((category) => {
                const categoryTopics = topics.filter(t => t.categoryId === category._id);
                return (
                  <AccordionItem 
                    key={category._id} 
                    value={category._id?.toString() || ''} 
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
                      <div className="space-y-1 pl-4">
                        {categoryTopics.map((topic) => (
                          <button
                            key={topic._id}
                            onClick={() => setSelectedTopic(topic)}
                            className={`w-full text-left px-2 py-0.25 rounded-md text-[16px] ${
                              selectedTopic?._id === topic._id
                                ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white'
                                : 'text-[#534e4e] dark:text-[#76a3ad] hover:bg-black/5 dark:hover:bg-white/5'
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
                  <p className="text-[18px] text-[#534e4e] dark:text-[#76a3ad] mb-6">
                    {selectedTopic.description}
                  </p>
                  
                  {loading ? (
                    <div className="text-center py-4">Loading articles...</div>
                  ) : error ? (
                    <div className="text-red-500 py-4">Error: {error}</div>
                  ) : articles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <img 
                        src="/construction.svg" 
                        alt="Under Construction" 
                        className="w-32 h-32 opacity-50 construction-icon"
                      />
                      <div className="text-2xl font-semibold text-gray-500 dark:text-gray-400 construction-text">
                        Konstruksiya olunur
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {articles.map((article) => (
                        <div key={article._id} className="prose dark:prose-invert">
                          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
                            {article.title}
                          </h2>
                          <div className="text-[18px] text-[#534e4e] dark:text-[#76a3ad] mb-4">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({inline, className, children, ...props}: CodeProps) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const language = match ? match[1] : '';
                                  return !inline ? (
                                    <div className="inline-block min-w-fit rounded-lg bg-white dark:bg-[#242638] p-6">
                                      <SyntaxHighlighter
                                        language={language}
                                        style={isDarkMode ? vscDarkPlus : vs}
                                        customStyle={{
                                          ...customStyle,
                                          backgroundColor: isDarkMode ? '#242638' : 'white',
                                        }}
                                        className="!m-0 !p-0 !border-none [&>span]:!bg-transparent [&>*]:!text-[18px] rounded-lg"
                                        wrapLongLines={true}
                                        showLineNumbers={true}
                                        lineNumberStyle={{
                                          minWidth: '2.5em',
                                          paddingRight: '1em',
                                          textAlign: 'right',
                                          userSelect: 'none',
                                          opacity: 0.5,
                                          fontSize: '18px',
                                          color: isDarkMode ? '#76a3ad' : '#534e4e'
                                        }}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    </div>
                                  ) : (
                                    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
                                      {children}
                                    </code>
                                  );
                                }
                              }}
                            >
                              {article.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : selectedLanguage && categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <img 
                    src="/construction.svg" 
                    alt="Under Construction" 
                    className="w-32 h-32 opacity-50 construction-icon"
                  />
                  <div className="text-2xl font-semibold text-gray-500 dark:text-gray-400 construction-text">
                    Konstruksiya olunur
                  </div>
                  <div className="text-lg text-gray-400 dark:text-gray-500 coming-soon-text">
                    {selectedLanguage.name} content coming soon
                  </div>
                </div>
              ) : topics.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <img 
                    src="/construction.svg" 
                    alt="Under Construction" 
                    className="w-32 h-32 opacity-50 construction-icon"
                  />
                  <div className="text-2xl font-semibold text-gray-500 dark:text-gray-400 construction-text">
                    Konstruksiya olunur
                  </div>
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
              Time Of Code {new Date().getFullYear()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 