'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  StarOff, 
  Search, 
  ArrowLeft,
  HelpCircle,
  CheckCircle,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';

interface FAQ {
  _id: string;
  topic_title: string;
  description?: string;
  slug: string;
  questions?: Array<{ question: string; answer: string }>;
  views?: number;
  is_active?: boolean;
  featured?: boolean;
}

interface Stats {
  total?: number;
  active?: number;
  inactive?: number;
  featured?: number;
  totalViews?: number;
}

function ManageFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<Stats>({});
  const [filters, setFilters] = useState({
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false
  });
  const router = useRouter();

  useEffect(() => {
    fetchFAQs();
    fetchStats();
  }, [filters, pagination.current]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', pagination.current.toString());
      params.append('limit', '10');
      if (filters.search) params.append('search', filters.search);

      const response = await axiosInstance.get(`/api/faqs/admin/all?${params}`);
      setFaqs(response.data.faqs);
      setPagination(response.data.pagination);
    } catch (error) {
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/api/faqs/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleCreate = () => {
    router.push('/admin/create-faq');
  };

  const handleEdit = (faq: FAQ) => {
    router.push(`/admin/edit-faq/${faq._id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await axiosInstance.delete(`/api/faqs/admin/${id}`);
        fetchFAQs();
        fetchStats();
      } catch (error) {
        setError('Failed to delete FAQ');
      }
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await axiosInstance.patch(`/api/faqs/admin/${id}/featured`);
      fetchFAQs();
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
    }
  };

  if (loading && faqs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Manage FAQs</h1>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add FAQ</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featured || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Topic Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {faqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <HelpCircle className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{faq.topic_title}</div>
                          {faq.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{faq.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{faq.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{faq.questions?.length || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{faq.views || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          faq.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {faq.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(faq._id, faq.featured || false)}
                          className={`p-2 rounded-lg transition-colors ${
                            faq.featured 
                              ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                              : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                          }`}
                          title={faq.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          {faq.featured ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(faq._id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {faqs.length} of {pagination.total || 0} FAQs
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
              {pagination.current} of {pagination.total || 1}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
              disabled={!pagination.hasNext}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManageFAQs;

