'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, Language, Category, Topic, Article } from '../services/api';
import MDEditor from '@uiw/react-md-editor';
import { languages as programmingLanguages } from '@/lib/programming-languages';
import { Pencil, LogOut, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  // State for languages
  const [languages, setLanguages] = useState<Language[]>([]);
  const [newLanguage, setNewLanguage] = useState({ 
    name: '', 
    description: '', 
    icon: '', 
    difficulty: 1,
    popularity: 1,
    category: [] as string[]
  });
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);

  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    description: '', 
    languageId: '', 
    order: 0 
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // State for topics
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    categoryId: '',
    order: 0
  });
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [selectedLanguageForTopics, setSelectedLanguageForTopics] = useState('');
  const [topicCategories, setTopicCategories] = useState<Category[]>([]);

  // State for articles
  const [articles, setArticles] = useState<Article[]>([]);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    topicId: '',
    order: 0
  });
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleContent, setArticleContent] = useState('');
  const [defaultCodeLanguage, setDefaultCodeLanguage] = useState('plaintext');

  // Load data when tab changes
  const handleTabChange = async (value: string) => {
    switch (value) {
      case 'languages':
        try {
          const languagesData = await api.languages.getAll();
          setLanguages(languagesData);
        } catch (error) {
          console.error('Error fetching languages:', error);
        }
        break;

      case 'categories':
        if (languages.length > 0 && languages[0]._id) {
          try {
            const categoriesData = await api.categories.getByLanguage(languages[0]._id);
            setCategories(categoriesData);
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        }
        break;

      case 'topics':
        if (categories.length > 0 && categories[0]._id) {
          try {
            const topicsData = await api.topics.getByCategory(categories[0]._id);
            setTopics(topicsData);
          } catch (error) {
            console.error('Error fetching topics:', error);
          }
        }
        break;

      case 'articles':
        if (topics.length > 0 && topics[0]._id) {
          try {
            const articlesData = await api.articles.getByTopic(topics[0]._id);
            setArticles(articlesData);
          } catch (error) {
            console.error('Error fetching articles:', error);
          }
        }
        break;
    }
  };

  // Initial data load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Load languages first
        const languagesData = await api.languages.getAll();
        setLanguages(languagesData);

        // If we have languages, load categories for the first language
        if (languagesData.length > 0 && languagesData[0]._id) {
          const categoriesData = await api.categories.getByLanguage(languagesData[0]._id);
          setCategories(categoriesData);

          // If we have categories, load topics for the first category
          if (categoriesData.length > 0 && categoriesData[0]._id) {
            const topicsData = await api.topics.getByCategory(categoriesData[0]._id);
            setTopics(topicsData);

            // If we have topics, load articles for the first topic
            if (topicsData.length > 0 && topicsData[0]._id) {
              const articlesData = await api.articles.getByTopic(topicsData[0]._id);
              setArticles(articlesData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch categories for topics
  const fetchCategoriesForTopics = async (languageId: string) => {
    try {
      const data = await api.categories.getByLanguage(languageId);
      setTopicCategories(data);
    } catch (error) {
      console.error('Error fetching categories for topics:', error);
    }
  };

  // Edit handlers
  const handleEditLanguage = async (language: Language) => {
    setEditingLanguage(language);
    setNewLanguage(language);
  };

  const handleEditCategory = async (category: Category) => {
    setEditingCategory(category);
    setNewCategory(category);
  };

  const handleEditTopic = async (topic: Topic) => {
    setEditingTopic(topic);
    setNewTopic(topic);
  };

  const handleEditArticle = async (article: Article) => {
    setEditingArticle(article);
    setNewArticle(article);
    setArticleContent(article.content);
  };

  // Submit handlers
  const handleLanguageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLanguage) {
        await api.languages.update(editingLanguage._id!, newLanguage);
        setEditingLanguage(null);
      } else {
        await api.languages.create(newLanguage);
      }
      setNewLanguage({ 
        name: '', 
        description: '', 
        icon: '', 
        difficulty: 1,
        popularity: 1,
        category: []
      });
      const updatedLanguages = await api.languages.getAll();
      setLanguages(updatedLanguages);
    } catch (error) {
      console.error('Error handling language:', error);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.categories.update(editingCategory._id!, newCategory);
        setEditingCategory(null);
      } else {
        await api.categories.create(newCategory);
      }
      setNewCategory({ name: '', description: '', languageId: '', order: 0 });
      if (newCategory.languageId) {
        const data = await api.categories.getByLanguage(newCategory.languageId);
        setCategories(data);
      }
    } catch (error) {
      console.error('Error handling category:', error);
    }
  };

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        await api.topics.update(editingTopic._id!, newTopic);
        setEditingTopic(null);
      } else {
        await api.topics.create(newTopic);
      }
      setNewTopic({ title: '', description: '', categoryId: '', order: 0 });
      if (newTopic.categoryId) {
        const data = await api.topics.getByCategory(newTopic.categoryId);
        setTopics(data);
      }
    } catch (error) {
      console.error('Error handling topic:', error);
    }
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const processedContent = articleContent.replace(
        /```([\s\S]*?)```/g,
        (match, code) => {
          if (match.startsWith('```\n')) {
            return `\`\`\`${defaultCodeLanguage}\n${code}\`\`\``;
          }
          return match;
        }
      );

      if (editingArticle) {
        await api.articles.update(editingArticle._id!, {
          ...newArticle,
          content: processedContent
        });
        setEditingArticle(null);
      } else {
        await api.articles.create({
          ...newArticle,
          content: processedContent
        });
      }
      setNewArticle({ title: '', content: '', topicId: '', order: 0 });
      setArticleContent('');
      setDefaultCodeLanguage('plaintext');
    } catch (error) {
      console.error('Error handling article:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Delete handlers
  const handleDeleteClick = (type: 'language' | 'category' | 'topic' | 'article', id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${type} "${name}"? This action cannot be undone.${
      type === 'language' ? '\n\nThis will also delete all associated categories, topics, and articles.' :
      type === 'category' ? '\n\nThis will also delete all associated topics and articles.' :
      type === 'topic' ? '\n\nThis will also delete all associated articles.' : ''
    }`)) {
      handleDelete(type, id);
    }
  };

  const handleDelete = async (type: 'language' | 'category' | 'topic' | 'article', id: string) => {
    try {
      // Use the API service for deletion
      switch (type) {
        case 'language':
          await api.languages.delete(id);
          const languagesData = await api.languages.getAll();
          setLanguages(languagesData);
          break;
        case 'category':
          await api.categories.delete(id);
          if (newCategory.languageId) {
            const categoriesData = await api.categories.getByLanguage(newCategory.languageId);
            setCategories(categoriesData);
          }
          break;
        case 'topic':
          await api.topics.delete(id);
          if (newTopic.categoryId) {
            const topicsData = await api.topics.getByCategory(newTopic.categoryId);
            setTopics(topicsData);
          }
          break;
        case 'article':
          await api.articles.delete(id);
          if (newArticle.topicId) {
            const articlesData = await api.articles.getByTopic(newArticle.topicId);
            setArticles(articlesData);
          }
          break;
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7fa] dark:bg-[#131516] p-6">
      <Card className="max-w-6xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black dark:text-white">Admin Dashboard</h1>
            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <Tabs defaultValue="languages" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
            </TabsList>

            <TabsContent value="languages">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Existing Languages</h2>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang._id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>{lang.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                          onClick={() => handleEditLanguage(lang)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          className="hover:bg-red-100 dark:hover:bg-red-900 p-2"
                          onClick={() => handleDeleteClick('language', lang._id!, lang.name)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleLanguageSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold">{editingLanguage ? 'Edit Language' : 'Add New Language'}</h2>
                <Input
                  placeholder="Language Name"
                  value={newLanguage.name}
                  onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={newLanguage.description}
                  onChange={(e) => setNewLanguage({ ...newLanguage, description: e.target.value })}
                />
                <Input
                  placeholder="Icon URL"
                  value={newLanguage.icon}
                  onChange={(e) => setNewLanguage({ ...newLanguage, icon: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button type="submit">{editingLanguage ? 'Update' : 'Add'} Language</Button>
                  {editingLanguage && (
                    <Button type="button" className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => {
                      setEditingLanguage(null);
                      setNewLanguage({ 
                        name: '', 
                        description: '', 
                        icon: '', 
                        difficulty: 1,
                        popularity: 1,
                        category: []
                      });
                    }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>

            <TabsContent value="categories">
              <div className="mb-6">
                <div className="mb-4">
                  <Select
                    value={newCategory.languageId}
                    onValueChange={async (value) => {
                      setNewCategory({ ...newCategory, languageId: value });
                      try {
                        const categoriesData = await api.categories.getByLanguage(value);
                        setCategories(categoriesData);
                      } catch (error) {
                        console.error('Error fetching categories:', error);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language to View Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang._id} value={lang._id || ''}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <h2 className="text-lg font-semibold mb-2">Existing Categories</h2>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat._id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                          onClick={() => handleEditCategory(cat)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          className="hover:bg-red-100 dark:hover:bg-red-900 p-2"
                          onClick={() => handleDeleteClick('category', cat._id!, cat.name)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <h2 className="text-lg font-semibold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                <Select
                  value={newCategory.languageId}
                  onValueChange={(value) => setNewCategory({ ...newCategory, languageId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang._id} value={lang._id || ''}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Order"
                  value={newCategory.order}
                  onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) })}
                />
                <div className="flex gap-2">
                  <Button type="submit">{editingCategory ? 'Update' : 'Add'} Category</Button>
                  {editingCategory && (
                    <Button type="button" className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => {
                      setEditingCategory(null);
                      setNewCategory({ name: '', description: '', languageId: '', order: 0 });
                    }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>

            <TabsContent value="topics">
              <div className="mb-6">
                <div className="mb-4">
                  <Select
                    value={selectedLanguageForTopics}
                    onValueChange={async (value) => {
                      setSelectedLanguageForTopics(value);
                      try {
                        const categoriesData = await api.categories.getByLanguage(value);
                        setTopicCategories(categoriesData);
                        if (categoriesData.length > 0) {
                          const topicsData = await api.topics.getByCategory(categoriesData[0]._id!);
                          setTopics(topicsData);
                        }
                      } catch (error) {
                        console.error('Error fetching categories and topics:', error);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language to View Topics" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang._id} value={lang._id || ''}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <h2 className="text-lg font-semibold mb-2">Existing Topics</h2>
                <div className="space-y-2">
                  {topics.map((topic) => (
                    <div key={topic._id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>{topic.title}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                          onClick={() => handleEditTopic(topic)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          className="hover:bg-red-100 dark:hover:bg-red-900 p-2"
                          onClick={() => handleDeleteClick('topic', topic._id!, topic.title)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleTopicSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold">{editingTopic ? 'Edit Topic' : 'Add New Topic'}</h2>
                <Select
                  value={selectedLanguageForTopics}
                  onValueChange={(value) => {
                    setSelectedLanguageForTopics(value);
                    fetchCategoriesForTopics(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang._id} value={lang._id || ''}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newTopic.categoryId}
                  onValueChange={(value) => setNewTopic({ ...newTopic, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {topicCategories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id || ''}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Topic Title"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Order"
                  value={newTopic.order}
                  onChange={(e) => setNewTopic({ ...newTopic, order: parseInt(e.target.value) })}
                />
                <div className="flex gap-2">
                  <Button type="submit">{editingTopic ? 'Update' : 'Add'} Topic</Button>
                  {editingTopic && (
                    <Button type="button" className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => {
                      setEditingTopic(null);
                      setNewTopic({ title: '', description: '', categoryId: '', order: 0 });
                    }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>

            <TabsContent value="articles">
              <div className="mb-6">
                <div className="space-y-4 mb-4">
                  <Select
                    value={selectedLanguageForTopics}
                    onValueChange={async (value) => {
                      setSelectedLanguageForTopics(value);
                      try {
                        const categoriesData = await api.categories.getByLanguage(value);
                        setTopicCategories(categoriesData);
                        if (categoriesData.length > 0) {
                          const topicsData = await api.topics.getByCategory(categoriesData[0]._id!);
                          setTopics(topicsData);
                          if (topicsData.length > 0) {
                            const articlesData = await api.articles.getByTopic(topicsData[0]._id!);
                            setArticles(articlesData);
                          }
                        }
                      } catch (error) {
                        console.error('Error fetching data:', error);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang._id} value={lang._id || ''}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={newArticle.topicId}
                    onValueChange={async (value) => {
                      setNewArticle({ ...newArticle, topicId: value });
                      try {
                        const articlesData = await api.articles.getByTopic(value);
                        setArticles(articlesData);
                      } catch (error) {
                        console.error('Error fetching articles:', error);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Topic to View Articles" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic._id} value={topic._id || ''}>
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <h2 className="text-lg font-semibold mb-2">Existing Articles</h2>
                <div className="space-y-2">
                  {articles.map((article) => (
                    <div key={article._id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>{article.title}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                          onClick={() => handleEditArticle(article)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          className="hover:bg-red-100 dark:hover:bg-red-900 p-2"
                          onClick={() => handleDeleteClick('article', article._id!, article.title)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleArticleSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold">{editingArticle ? 'Edit Article' : 'Add New Article'}</h2>
                <Input
                  placeholder="Article Title"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                />
                <Select
                  value={defaultCodeLanguage}
                  onValueChange={setDefaultCodeLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Default Code Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {programmingLanguages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tip: Use ```language for specific code blocks. Default language will be used for unmarked code blocks.
                  </p>
                  <div data-color-mode="dark">
                    <MDEditor
                      value={articleContent}
                      onChange={(value) => setArticleContent(value || '')}
                      preview="edit"
                      height={400}
                    />
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="Order"
                  value={newArticle.order}
                  onChange={(e) => setNewArticle({ ...newArticle, order: parseInt(e.target.value) })}
                />
                <div className="flex gap-2">
                  <Button type="submit">{editingArticle ? 'Update' : 'Add'} Article</Button>
                  {editingArticle && (
                    <Button type="button" className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => {
                      setEditingArticle(null);
                      setNewArticle({ title: '', content: '', topicId: '', order: 0 });
                      setArticleContent('');
                    }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 