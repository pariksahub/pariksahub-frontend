'use client';

import React, { useState, useEffect } from 'react';
import { X, FileText, Save, Trash2, Plus, Edit3, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  () => import('react-quill-new'),
  { 
    ssr: false,
      loading: () => <div className="h-[200px] bg-[#161B33] rounded-lg animate-pulse" />
  }
);

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt: string;
}

const FloatingNotes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | { id: null; title: string; content: string }>({ id: null, title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [showMobileView, setShowMobileView] = useState<'list' | 'editor'>('list');

  useEffect(() => {
    // Load Quill CSS on client side
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
      document.head.appendChild(link);
      
      // Add custom style for dark theme and placeholder visibility
      const style = document.createElement('style');
      style.textContent = `
        .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.6) !important;
          font-style: normal !important;
        }
        .ql-snow .ql-picker-options {
          background-color: #161B33 !important;
          border: 1px solid #4B5563 !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3) !important;
        }
        .ql-snow .ql-picker-item {
          color: white !important;
        }
        .ql-snow .ql-picker-item:hover {
          background-color: #1a1f3a !important;
          color: white !important;
        }
        .ql-snow .ql-picker-item.ql-selected {
          background-color: #6366F1 !important;
          color: white !important;
        }
        .ql-snow .ql-picker-label {
          color: white !important;
        }
        .ql-snow .ql-picker-label:hover {
          color: #8B5CF6 !important;
        }
        .ql-snow .ql-stroke {
          stroke: white !important;
        }
        .ql-snow .ql-fill {
          fill: white !important;
        }
        .ql-snow .ql-picker {
          color: white !important;
        }
        .ql-snow .ql-toolbar {
          background-color: #161B33 !important;
          border-color: #374151 !important;
          border-bottom: 1px solid #374151 !important;
        }
       .ql-snow .ql-toolbar {
          background-color: #161B33 !important;
          border-color: #374151 !important;
          border-bottom: 1px solid #374151 !important;
          display: flex !important;
          justify-content: flex-start !important;
          align-items: center !important;
        }
        .ql-snow .ql-toolbar button:hover,
        .ql-snow .ql-toolbar button:focus,
        .ql-snow .ql-toolbar button.ql-active {
          color: #6366F1 !important;
          background-color: rgba(99, 102, 241, 0.1) !important;
        }
        .ql-snow .ql-toolbar button:hover .ql-stroke,
        .ql-snow .ql-toolbar button:focus .ql-stroke,
        .ql-snow .ql-toolbar button.ql-active .ql-stroke {
          stroke: #6366F1 !important;
        }
        .ql-snow .ql-toolbar button:hover .ql-fill,
        .ql-snow .ql-toolbar button:focus .ql-fill,
        .ql-snow .ql-toolbar button.ql-active .ql-fill {
          fill: #6366F1 !important;
        }
        .ql-snow .ql-toolbar .ql-picker-label {
          color: white !important;
        }
        .ql-snow .ql-toolbar .ql-picker-label:hover {
          color: #8B5CF6 !important;
        }
        .ql-snow .ql-toolbar .ql-picker-label.ql-active {
          color: #6366F1 !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        // Cleanup
        const existingLink = document.querySelector('link[href="https://cdn.quilljs.com/1.3.6/quill.snow.css"]');
        if (existingLink) {
          existingLink.remove();
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      };
    }
  }, []);

  useEffect(() => {
    const savedNotes = localStorage.getItem('userNotes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Error parsing saved notes:', error);
      }
    }
  }, []);

  const saveToLocalStorage = (notesToSave: Note[]) => {
    localStorage.setItem('userNotes', JSON.stringify(notesToSave));
  };

  const openModal = () => {
    setIsModalOpen(true);
    setShowMobileView('list');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNote({ id: null, title: '', content: '' });
    setIsEditing(false);
    setSelectedNoteId(null);
    setShowMobileView('list');
  };

  const createNewNote = () => {
    setCurrentNote({ id: null, title: '', content: '' });
    setIsEditing(true);
    setSelectedNoteId(null);
    setShowMobileView('editor');
  };

  const saveNote = () => {
    if (!currentNote.title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    const now = new Date().toISOString();
    let updatedNotes;

    if (currentNote.id) {
      updatedNotes = notes.map(note =>
        note.id === currentNote.id
          ? { ...currentNote, updatedAt: now }
          : note
      );
    } else {
      const newNote = {
        id: Date.now(),
        title: currentNote.title,
        content: currentNote.content,
        createdAt: now,
        updatedAt: now
      };
      updatedNotes = [...notes, newNote];
    }

    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
    setIsEditing(false);
    setCurrentNote({ id: null, title: '', content: '' });
    setShowMobileView('list');
  };

  const editNote = (note: Note) => {
    setCurrentNote(note);
    setIsEditing(true);
    setSelectedNoteId(note.id);
    setShowMobileView('editor');
  };

  const deleteNote = (noteId: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
      saveToLocalStorage(updatedNotes);
      if (selectedNoteId === noteId) {
        setCurrentNote({ id: null, title: '', content: '' });
        setIsEditing(false);
        setSelectedNoteId(null);
      }
    }
  };

  const selectNote = (note: Note) => {
    setCurrentNote(note);
    setSelectedNoteId(note.id);
    setIsEditing(false);
    setShowMobileView('editor');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'link' 
  ];

  const goBackToList = () => {
    setShowMobileView('list');
    setIsEditing(false);
  };

  return (
    <>
      {/* Floating Notes Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={openModal}
          className="bg-[#6366F1] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:shadow-[#6366F1]/50 transition-all duration-300 hover:scale-110 group"
          title="Open Notes"
        >
          <FileText className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center backdrop-blur-sm p-4 md:p-6">
          <div className="bg-[#161B33] border border-gray-800 w-full max-w-7xl h-[85vh] md:h-[80vh] md:rounded-xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="bg-[#0A0E27] border-b border-gray-800 text-white p-4 md:p-6 flex items-center justify-between md:rounded-t-xl flex-shrink-0">
              <div className="flex items-center">
                {showMobileView === 'editor' && (
                  <button
                    onClick={goBackToList}
                    className="md:hidden text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full mr-2"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                  </button>
                )}
                <h2 className="text-xl md:text-2xl font-bold text-white">My Notes</h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Notes List Sidebar */}
              <div className={`${showMobileView === 'list' ? 'w-full' : 'hidden'} md:w-1/3 md:block bg-[#0A0E27] border-r border-gray-800 flex flex-col`}>
                <div className="p-4 border-b border-gray-800">
                  <button
                    onClick={createNewNote}
                    className="w-full bg-[#6366F1] text-white py-3 px-4 rounded-xl hover:bg-[#5558E3] transition-colors flex items-center justify-center space-x-2 font-bold"
                  >
                    <Plus className="w-5 h-5 text-white" />
                    <span>New Note</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0A0E27] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
                  {notes.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                      <p className="text-white/80">No notes yet. Create your first note!</p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          onClick={() => selectNote(note)}
                          className={`p-4 rounded-xl cursor-pointer transition-colors border ${
                            selectedNoteId === note.id
                              ? 'bg-[#6366F1] text-white border-[#6366F1]'
                              : 'bg-[#161B33] hover:bg-[#1a1f3a] border-gray-800 hover:border-[#6366F1]'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold text-sm truncate mb-1 ${
                                selectedNoteId === note.id ? 'text-white' : 'text-white/80'
                              }`}>
                                {note.title}
                              </h3>
                              <p className={`text-xs ${
                                selectedNoteId === note.id ? 'text-white/80' : 'text-gray-400'
                              }`}>
                                {formatDate(note.updatedAt)}
                              </p>
                            </div>
                            <div className="flex space-x-1 ml-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editNote(note);
                                }}
                                className={`p-1 hover:bg-white/20 rounded transition-colors ${
                                  selectedNoteId === note.id ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNote(note.id);
                                }}
                                className={`p-1 hover:bg-red-500/20 rounded transition-colors ${
                                  selectedNoteId === note.id ? 'text-white hover:text-red-400' : 'text-red-400 hover:text-red-300'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Note Editor/Viewer */}
              <div className={`${showMobileView === 'editor' ? 'w-full' : 'hidden'} md:flex-1 md:flex md:flex-col bg-[#161B33]`}>
                {isEditing ? (
                  <div className="flex-1 flex flex-col">
                    <div className="p-4 bg-[#0A0E27] border-b border-gray-800">
                      <input
                        type="text"
                        value={currentNote.title}
                        onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                        placeholder="Note title..."
                        className="w-full p-3 bg-[#161B33] border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-lg font-semibold text-white placeholder-gray-500"
                      />
                    </div>
                    <div className="flex-1 p-4 overflow-hidden">
                      <ReactQuill
                        value={currentNote.content}
                        onChange={(content) => setCurrentNote({ ...currentNote, content })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Start writing your note..."
                        className="h-full [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:max-h-[calc(100vh-400px)] [&_.ql-container]:max-h-[calc(100vh-400px)] [&_.ql-container]:bg-[#0A0E27] [&_.ql-editor]:bg-[#0A0E27] [&_.ql-editor]:text-white [&_.ql-toolbar]:bg-[#161B33] [&_.ql-toolbar]:border-gray-800 [&_.ql-toolbar]:border-b [&_.ql-toolbar_.ql-stroke]:stroke-white [&_.ql-toolbar_.ql-fill]:fill-white [&_.ql-toolbar_.ql-picker-label]:text-white [&_.ql-toolbar_.ql-picker-options]:bg-[#161B33] [&_.ql-toolbar_.ql-picker-item]:text-white [&_.ql-toolbar_.ql-picker]:color-white"
                      />
                    </div>
                    <div className="p-4 bg-[#0A0E27] border-t border-gray-800 flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-3">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setShowMobileView('list');
                        }}
                        className="px-6 py-2 bg-[#161B33] border border-gray-800 text-white rounded-xl hover:bg-[#1a1f3a] transition-colors font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveNote}
                        className="px-6 py-2 bg-[#6366F1] text-white rounded-xl hover:bg-[#5558E3] transition-colors flex items-center justify-center space-x-2 font-bold"
                      >
                        <Save className="w-4 h-4 text-white" />
                        <span>Save Note</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    {selectedNoteId ? (
                      <>
                        <div className="p-4 bg-[#0A0E27] border-b border-gray-800">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
                                {currentNote.title}
                              </h1>
                              <p className="text-gray-400 text-sm">
                                Last updated: {currentNote.id ? formatDate((currentNote as Note).updatedAt) : 'N/A'}
                              </p>
                            </div>
                            <button
                              onClick={() => editNote(currentNote as unknown as Note)}
                              className="ml-4 p-2 text-[#6366F1] hover:bg-[#6366F1] hover:text-white rounded-full transition-colors"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0A0E27] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
                          <div 
                            className="prose max-w-none quill-content prose-invert prose-headings:text-white prose-p:text-white/80 prose-strong:text-white prose-a:text-[#6366F1]"
                            dangerouslySetInnerHTML={{ __html: currentNote.content }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                          <p className="text-xl mb-2 text-white">Select a note to view</p>
                          <p className="text-white/80">Choose a note from the sidebar or create a new one</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingNotes;

