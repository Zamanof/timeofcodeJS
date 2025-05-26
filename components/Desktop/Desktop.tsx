'use client'

import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search } from "lucide-react";
import { Switch } from "@headlessui/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const customStyle = {
  'pre[class*="language-"]': {
    background: 'transparent',
  },
  'code[class*="language-"]': {
    background: 'transparent',
  },
  'span': {
    background: 'transparent',
  },
};

export const Desktop = (): JSX.Element => {
  const [enabled, setEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Update dark mode class on document root when switch changes
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setIsDarkMode(enabled);
  }, [enabled]);

  const programmingLanguages = [
    "Python", "C#", "C++", "Java", "HTML", "JS", "React"
  ];

  const pythonTopics = [
    { title: "Python Intro", subtopics: ["Python Language", "Python Install", "First Program", "Pycharm", "Visual Studio Code"] },
    { title: "Python Essential" },
    { title: "Python OOP" },
    { title: "Exceptions" },
    { title: "Modules" },
    { title: "String" },
    { title: "Pattern Matching", subtopics: ["List", "Tuple", "Dictionary", "Set", "Frozen Set"] },
    { title: "Files" },
  ];

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
              <Tabs defaultValue="python" className="w-full">
                <TabsList className="bg-transparent shadow-none">
                  {programmingLanguages.map((lang, index) => (
                    <TabsTrigger
                      key={index}
                      value={lang.toLowerCase()}
                      className="bg-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white text-[#534e4e] dark:text-[#cccccc] hover:bg-transparent hover:shadow-none relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 data-[state=active]:after:scale-x-100 after:bg-black dark:after:bg-white after:transition-transform text-[16px]"
                    >
                      {lang}
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
                  className="w-[300px] pl-9 border-[0.5px] border-black dark:border-white rounded-[10px] bg-transparent text-[16px] font-normal text-[#534e4e] dark:text-[#cccccc] placeholder:text-[#534e4e] dark:placeholder:text-[#cccccc]"
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
            <Accordion type="multiple" defaultValue={["0", "6"]}>
              {pythonTopics.map((topic, index) => (
                <AccordionItem key={index} value={index.toString()} className="border-none">
                  <AccordionTrigger className="font-medium text-[#534e4e] dark:text-[#cccccc] text-[16px] py-1 hover:no-underline">
                    {topic.title}
                  </AccordionTrigger>
                  {topic.subtopics && (
                    <AccordionContent>
                      <ul className="pl-4 space-y-1">
                        {topic.subtopics.map((subtopic, subIndex) => (
                          <li
                            key={subIndex}
                            className="font-normal text-[#534e4e] dark:text-[#cccccc] text-[16px] cursor-pointer hover:text-black dark:hover:text-white"
                          >
                            {subtopic}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="flex-1 border-[0.5px] border-black dark:border-white rounded-[10px]">
          <CardContent className="p-4">
            <div className="w-full space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h1 className="text-2xl font-bold text-black dark:text-white">Python Programming</h1>
                <p className="text-[#534e4e] dark:text-[#cccccc]">
                  Python is a high-level, interpreted programming language known for its simplicity and readability. 
                  It emphasizes code readability with its notable use of significant whitespace.
                </p>
                <h2 className="text-xl font-semibold text-black dark:text-white mt-4">Key Features:</h2>
                <ul className="list-disc pl-6 text-[#534e4e] dark:text-[#cccccc]">
                  <li>Easy to learn and read</li>
                  <li>Large standard library</li>
                  <li>Dynamic typing and dynamic binding</li>
                  <li>Object-oriented programming support</li>
                  <li>Extensive third-party packages</li>
                </ul>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-2">Example: Basic Python Concepts</h2>
                <SyntaxHighlighter
                  language="python"
                  style={isDarkMode ? {...vscDarkPlus, ...customStyle} : {...vs, ...customStyle}}
                  customStyle={{
                    padding: '1rem',
                    margin: 0,
                    borderRadius: '10px',
                    width: 'fit-content',
                    backgroundColor: isDarkMode ? 'rgb(56, 58, 66)' : 'white',
                    boxShadow: isDarkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  showLineNumbers={true}
                  lineNumberStyle={{
                    minWidth: '3em',
                    paddingRight: '1em',
                    color: isDarkMode ? '#cccccc' : '#534e4e',
                    textAlign: 'right'
                  }}
                >
{`# Basic Python concepts demonstration

# 1. Variables and Data Types
name = "Python"
version = 3.11
is_awesome = True

# 2. Lists and List Operations
languages = ["Python", "JavaScript", "Java", "C++"]
languages.append("Ruby")
first_language = languages[0]

# 3. Functions
def greet(name, language="Python"):
    """A simple greeting function with a default parameter"""
    return f"Hello! I'm learning {language}, my name is {name}!"

# 4. Control Flow
def check_number(num):
    if num > 0:
        return "Positive"
    elif num < 0:
        return "Negative"
    else:
        return "Zero"

# 5. List Comprehension
squares = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]

# 6. Classes and Objects
class Programmer:
    def __init__(self, name, language):
        self.name = name
        self.language = language
    
    def code(self):
        return f"{self.name} is coding in {self.language}!"

# Usage example
dev = Programmer("Alice", "Python")
print(dev.code())  # Output: Alice is coding in Python!`}</SyntaxHighlighter>
              </div>

              <div className="prose dark:prose-invert max-w-none mt-4">
                <h2 className="text-xl font-semibold text-black dark:text-white">Getting Started</h2>
                <p className="text-[#534e4e] dark:text-[#cccccc]">
                  To start with Python, you'll need to install Python on your computer. The example above demonstrates several key Python concepts:
                </p>
                <ul className="list-disc pl-6 text-[#534e4e] dark:text-[#cccccc]">
                  <li>Basic variable declaration and data types</li>
                  <li>List operations and manipulation</li>
                  <li>Function definition with docstrings</li>
                  <li>Control flow statements</li>
                  <li>List comprehensions for concise list creation</li>
                  <li>Object-oriented programming with classes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Card className="w-full mt-2 border-[0.5px] border-black dark:border-white rounded-[10px]">
        <CardContent className="flex items-center justify-center p-4">
          <div className="flex items-center">
            <span className="font-normal text-black dark:text-white text-2xl">©</span>
            <span className="font-normal text-black dark:text-white text-[16px] ml-1">
              Nadir Zamanov 2024
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};