"use client"

import React from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface URLManagerProps {
  urls: string;
  entityDescription: string;
  onUrlsChange: (urls: string) => void;
  onEntityDescriptionChange: (entityDescription: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  error?: string;
  isSubmitting: boolean;
}

const URLManager: React.FC<URLManagerProps> = ({
  urls,
  entityDescription,
  onUrlsChange,
  onEntityDescriptionChange,
  onSubmit,
  onClear,
  error,
  isSubmitting
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold mb-4">Set Scraping page and content Target</h2>
    
    {error && (
      <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p>{error}</p>
      </div>
    )}
    
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <textarea
          value={urls}
          onChange={(e) => onUrlsChange(e.target.value)}
          placeholder="Enter URLs to index (one per line)&#10;Example:&#10;https://cloud.google.com/compute/docs/instances&#10;https://cloud.google.com/storage/docs/introduction"
          className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-4">
        <textarea
          value={entityDescription}
          onChange={(e) => onEntityDescriptionChange(e.target.value)}
          placeholder="Extract the main textual content from the url. Remove all navigation bars, ads, sidebars, and unrelated content. 
          Retain only the main article, report, or relevant body text. Format the output as plain text, with paragraphs and subheadings preserved if present. 
          Ensure each chunk starts and ends at logical sentence boundaries and preserves the semantic flow."
          className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={!urls.trim() || isSubmitting}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          {isSubmitting ? 'Fetching...' : 'Get Target Content'}
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={isSubmitting}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>
    </form>
  </div>
);

export default URLManager;