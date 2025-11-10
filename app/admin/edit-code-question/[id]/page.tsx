'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Trash2, AlertCircle, CheckCircle, ChevronUp, ChevronDown, Code, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';
import axiosInstance from '@/utils/axiosInstance';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  () => import('react-quill-new'),
  { ssr: false }
);

interface ContentBlock {
  type: 'code' | 'text';
  code?: string;
  language?: string;
  text_content?: string;
  order: number;
  label?: string;
}

interface ProgrammingTopic {
  _id: string;
  title: string;
  slug: string;
}

function EditCodeQuestion() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchingTopics, setFetchingTopics] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [topics, setTopics] = useState<ProgrammingTopic[]>([]);

  const [formData, setFormData] = useState({
    topic_id: '',
    title: '',
    description: '',
    difficulty: 'Medium',
    content_blocks: [{
      type: 'code' as const,
      code: '',
      language: 'python',
      order: 0,
      label: ''
    }] as ContentBlock[],
    order: 0,
    is_active: true
  });

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['code-block'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'link', 'image', 'video', 'code-block'
  ];

  useEffect(() => {
    fetchQuestion();
    fetchTopics();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      setFetching(true);
      const response = await axiosInstance.get(`/api/code-questions/admin/${id}`);
      const question = response.data;
      
      setFormData({
        topic_id: question.topic_id?._id || question.topic_id || '',
        title: question.title || '',
        description: question.description || '',
        difficulty: question.difficulty || 'Medium',
        content_blocks: question.content_blocks && question.content_blocks.length > 0
          ? question.content_blocks.map((block: any) => ({
              type: block.type,
              code: block.code || '',
              language: block.language || 'python',
              text_content: block.text_content || '',
              order: block.order || 0,
              label: block.label || ''
            }))
          : [{
              type: 'code' as const,
              code: '',
              language: 'python',
              order: 0,
              label: ''
            }],
        order: question.order || 0,
        is_active: question.is_active !== undefined ? question.is_active : true
      });
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to load question');
    } finally {
      setFetching(false);
    }
  };

  const fetchTopics = async () => {
    try {
      setFetchingTopics(true);
      const response = await axiosInstance.get('/api/programming-topics/admin/all?limit=100');
      setTopics(response.data.topics || []);
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setFetchingTopics(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!formData.topic_id || !formData.title.trim()) {
      setError('Topic and title are required');
      setLoading(false);
      return;
    }

    // Validate content blocks
    const hasContent = formData.content_blocks.some(block => {
      if (block.type === 'code') {
        return block.code && block.code.trim().length > 0;
      } else {
        return block.text_content && block.text_content.trim().length > 0;
      }
    });

    if (!hasContent) {
      setError('At least one content block (code or text) is required');
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.put(`/api/code-questions/admin/${id}`, formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/manage-code-questions');
      }, 1500);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to update question');
    } finally {
      setLoading(false);
    }
  };

  const addContentBlock = (type: 'code' | 'text') => {
    const newOrder = Math.max(...formData.content_blocks.map(b => b.order), -1) + 1;
    const newBlock: ContentBlock = type === 'code' 
      ? { type: 'code', code: '', language: 'python', order: newOrder, label: '' }
      : { type: 'text', text_content: '', order: newOrder };
    
    setFormData({
      ...formData,
      content_blocks: [...formData.content_blocks, newBlock]
    });
  };

  const removeContentBlock = (index: number) => {
    if (formData.content_blocks.length > 1) {
      setFormData({
        ...formData,
        content_blocks: formData.content_blocks.filter((_, i) => i !== index)
      });
    }
  };

  const updateContentBlock = (index: number, updates: Partial<ContentBlock>) => {
    const updated = [...formData.content_blocks];
    updated[index] = { ...updated[index], ...updates };
    setFormData({ ...formData, content_blocks: updated });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.content_blocks.length - 1) return;

    const updated = [...formData.content_blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // Update orders
    updated.forEach((block, i) => {
      block.order = i;
    });
    
    setFormData({ ...formData, content_blocks: updated });
  };


  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 mt-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 mt-5">
      <style dangerouslySetInnerHTML={{
        __html: `
          .ql-editor img {
            max-width: 100% !important;
            max-height: 400px !important;
            width: auto !important;
            height: auto !important;
            display: block !important;
            margin: 0.75rem auto !important;
            border-radius: 0.5rem;
            object-fit: contain;
          }
          
          .ql-editor img[style*="width"],
          .ql-editor img[style*="Width"] {
            max-width: 100% !important;
            width: auto !important;
          }
          
          .ql-editor img[style*="height"],
          .ql-editor img[style*="Height"] {
            max-height: 400px !important;
            height: auto !important;
          }
          
          @media (min-width: 768px) {
            .ql-editor img {
              max-width: 600px !important;
              max-height: 350px !important;
            }
          }
          
          @media (min-width: 1024px) {
            .ql-editor img {
              max-width: 700px !important;
              max-height: 400px !important;
            }
          }
        `
      }} />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-900" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Edit Code Question</h1>
            <p className="text-slate-600 text-sm mt-1">Update code question with multiple code blocks and explanations</p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700">Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-700">Success!</p>
              <p className="text-sm text-green-600">Question updated successfully. Redirecting...</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Topic <span className="text-red-500">*</span>
                </label>
                {fetchingTopics ? (
                  <div className="text-slate-600 text-sm">Loading topics...</div>
                ) : (
                  <select
                    value={formData.topic_id}
                    onChange={(e) => setFormData({ ...formData, topic_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  >
                    <option value="">Select a topic</option>
                    {topics.map(topic => (
                      <option key={topic._id} value={topic._id}>{topic.title}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  modules={quillModules}
                  formats={quillFormats}
                  className="h-64 mb-12"
                  placeholder="Brief description of the question..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Blocks Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Code className="text-indigo-600" />
                <h2 className="text-xl font-semibold text-slate-900">Content Blocks</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addContentBlock('code')}
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors text-sm flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  Add Code
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock('text')}
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors text-sm flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Add Text
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {formData.content_blocks.map((block, index) => (
                <div key={index} className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg">
                        {block.type === 'code' ? 'CODE' : 'TEXT'}
                      </span>
                      <span className="text-xs text-slate-500">Block {index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 hover:bg-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4 text-slate-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, 'down')}
                        disabled={index === formData.content_blocks.length - 1}
                        className="p-1.5 hover:bg-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4 text-slate-700" />
                      </button>
                      {formData.content_blocks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContentBlock(index)}
                          className="p-1.5 hover:bg-red-100 rounded text-red-600 transition-colors"
                          title="Remove block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {block.type === 'code' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                          <input
                            type="text"
                            value={block.language || ''}
                            onChange={(e) => updateContentBlock(index, { language: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                            placeholder="e.g., python, javascript, java"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Label (optional)</label>
                          <input
                            type="text"
                            value={block.label || ''}
                            onChange={(e) => updateContentBlock(index, { label: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                            placeholder="e.g., Solution 1, Optimized"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Code</label>
                        <textarea
                          value={block.code || ''}
                          onChange={(e) => updateContentBlock(index, { code: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm font-mono min-h-[200px]"
                          placeholder="Enter your code here..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Text Content (Explanation)</label>
                      <ReactQuill
                        theme="snow"
                        value={block.text_content || ''}
                        onChange={(value) => {
                          const updated = [...formData.content_blocks];
                          updated[index] = { ...updated[index], text_content: value };
                          setFormData({ ...formData, content_blocks: updated });
                        }}
                        modules={quillModules}
                        formats={quillFormats}
                        className="h-64 mb-12"
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-6 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        const newOrder = Math.max(...formData.content_blocks.map(b => b.order), -1) + 1;
                        const newBlock: ContentBlock = { 
                          type: 'code', 
                          code: '', 
                          language: 'python', 
                          order: newOrder, 
                          label: '' 
                        };
                        const updated = [...formData.content_blocks];
                        updated.splice(index + 1, 0, newBlock);
                        setFormData({ ...formData, content_blocks: updated });
                      }}
                      className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors text-sm flex items-center gap-2"
                    >
                      <Code className="w-4 h-4" />
                      Add Code
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newOrder = Math.max(...formData.content_blocks.map(b => b.order), -1) + 1;
                        const newBlock: ContentBlock = { 
                          type: 'text', 
                          text_content: '', 
                          order: newOrder 
                        };
                        const updated = [...formData.content_blocks];
                        updated.splice(index + 1, 0, newBlock);
                        setFormData({ ...formData, content_blocks: updated });
                      }}
                      className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors text-sm flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Add Text
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Settings</h2>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
              <div>
                <span className="font-medium text-slate-900">Active</span>
                <p className="text-sm text-slate-600">Make this question publicly visible</p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#EB5A3C] text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors font-medium"
            >
              {loading ? 'Updating...' : 'Update Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCodeQuestion;

