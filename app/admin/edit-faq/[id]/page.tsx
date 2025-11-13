'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle, CheckCircle, ChevronUp, ChevronDown, FileText, Edit } from 'lucide-react';
import dynamic from 'next/dynamic';
import axiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  () => import('react-quill-new'),
  { ssr: false }
);

interface Question {
  _id: number;
  question: string;
  answer: string;
  order: number;
}

function EditFAQ() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSlugEditable, setIsSlugEditable] = useState(false);

  const [formData, setFormData] = useState({
    topic_title: '',
    description: '',
    slug: '',
    questions: [{
      _id: 1,
      question: '',
      answer: '',
      order: 0
    }] as Question[],
    featured: false,
    is_active: true,
    tags: [] as string[]
  });
  const [nextQuestionId, setNextQuestionId] = useState(2);

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
    fetchFAQ();
  }, [id]);

  const fetchFAQ = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/faqs/admin/${id}`);
      const data = response.data;
      
      const sortedQuestions = data.questions && data.questions.length > 0 
        ? data.questions.sort((a: Question, b: Question) => (a.order || 0) - (b.order || 0))
        : [];

      const questionsWithIds = sortedQuestions.length > 0 
        ? sortedQuestions.map((q: any, index: number) => ({
            _id: index + 1,
            question: q.question || '',
            answer: q.answer || '',
            order: q.order !== undefined ? q.order : index
          }))
        : [{
            _id: 1,
            question: '',
            answer: '',
            order: 0
          }];

      setFormData({
        topic_title: data.topic_title || '',
        description: data.description || '',
        slug: data.slug || '',
        questions: questionsWithIds,
        featured: data.featured || false,
        is_active: data.is_active !== undefined ? data.is_active : true,
        tags: data.tags || []
      });
      setNextQuestionId(questionsWithIds.length + 1);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      if (error instanceof AxiosError && error.response?.status === 404) {
        setError('FAQ not found');
      } else {
        setError('Failed to load FAQ');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    const validQuestions = formData.questions.filter(q => q.question.trim() && q.answer.trim());

    if (!formData.topic_title.trim() || !formData.slug.trim()) {
      setError('Topic title and slug are required');
      setSaving(false);
      return;
    }

    if (validQuestions.length === 0) {
      setError('At least one question with answer is required');
      setSaving(false);
      return;
    }

    try {
      await axiosInstance.put(`/api/faqs/admin/${id}`, {
        ...formData,
        questions: validQuestions.map((q, index) => ({
          question: q.question,
          answer: q.answer,
          order: index
        }))
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/manage-faqs');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to update FAQ');
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        _id: nextQuestionId,
        question: '',
        answer: '',
        order: prev.questions.length
      }]
    }));
    setNextQuestionId(prev => prev + 1);
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index).map((q, i) => ({
          ...q,
          order: i
        }))
      }));
    }
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...formData.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[targetIndex];
    newQuestions[targetIndex] = temp;
    
    newQuestions.forEach((q, i) => {
      q.order = i;
    });

    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const updateTag = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 mt-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading FAQ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 mt-5">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/admin/manage-faqs')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-900" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Edit FAQ</h1>
            <p className="text-slate-600 text-sm mt-1">Update FAQ information</p>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-700">Success!</p>
              <p className="text-sm text-green-600">FAQ updated successfully!</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700">Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

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
                  Topic Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.topic_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic_title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="e.g., Python Programming FAQ"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">Slug</label>
                  <button
                    type="button"
                    onClick={() => setIsSlugEditable(!isSlugEditable)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    {isSlugEditable ? 'Done' : 'Edit'}
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  disabled={!isSlugEditable}
                  className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                    !isSlugEditable ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'
                  }`}
                  placeholder="python-programming-faq"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Brief description of this FAQ..."
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Featured</span>
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-slate-700">Tags</label>
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors text-sm flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Tag
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.tags.map((tag, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => updateTag(i, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                        placeholder="Enter tag"
                      />
                      <button
                        type="button"
                        onClick={() => removeTag(i)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="text-xs text-slate-500">No tags added</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Questions & Answers Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="text-indigo-600" />
                <h2 className="text-xl font-semibold text-slate-900">Questions & Answers</h2>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors text-sm flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {formData.questions.map((q, index) => (
                <div key={q._id} className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-slate-700">Question {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveQuestion(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 hover:bg-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <ChevronUp className="h-4 w-4 text-slate-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveQuestion(index, 'down')}
                        disabled={index === formData.questions.length - 1}
                        className="p-1.5 hover:bg-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <ChevronDown className="h-4 w-4 text-slate-700" />
                      </button>
                      {formData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="p-1.5 hover:bg-red-100 rounded text-red-600 transition-colors"
                          title="Remove question"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Question <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="Enter question..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Answer <span className="text-red-500">*</span>
                      </label>
                      <ReactQuill
                        value={q.answer}
                        onChange={(content) => updateQuestion(index, 'answer', content)}
                        modules={quillModules}
                        formats={quillFormats}
                        theme="snow"
                        className="h-64 mb-12"
                        placeholder="Enter answer..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/manage-faqs')}
              className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#EB5A3C] text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors font-medium flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditFAQ;

