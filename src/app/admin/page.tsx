"use client"

import React, { useState } from 'react';
import URLManager from '@/app/components/AdminPanel/URLManager';
import { DocumentList, DocumentListSkeleton } from '@/app/components/AdminPanel/DocumentList';
import ExtractedContentResults from '@/app/components/AdminPanel/ExtractedContentResults';

const urlsList = [
  "https://knowledge.neuronsinc.com",
  "https://knowledge.neuronsinc.com/",
  "https://knowledge.neuronsinc.com/ai-insights-and-recommendations",
  "https://knowledge.neuronsinc.com/api",
  "https://knowledge.neuronsinc.com/benchmark-aoi-definitions",
  "https://knowledge.neuronsinc.com/benchmark-category-definitions",
  "https://knowledge.neuronsinc.com/benchmark-industry-definitions",
  "https://knowledge.neuronsinc.com/benchmark-purpose-definitions",
  "https://knowledge.neuronsinc.com/benchmark-use-case-definitions",
  "https://knowledge.neuronsinc.com/change-remove-access",
  "https://knowledge.neuronsinc.com/change-reset-password",
  "https://knowledge.neuronsinc.com/comparison-tool",
  "https://knowledge.neuronsinc.com/delete-folders-and-files",
  "https://knowledge.neuronsinc.com/delete-your-account",
  "https://knowledge.neuronsinc.com/download-neurons-ai-results",
  "https://knowledge.neuronsinc.com/download-predict-results",
  "https://knowledge.neuronsinc.com/features-and-tools",
  "https://knowledge.neuronsinc.com/get-started",
  "https://knowledge.neuronsinc.com/getting-started-with-the-neurons-ai-api",
  "https://knowledge.neuronsinc.com/heatmap",
  "https://knowledge.neuronsinc.com/how-do-i-change-who-has-access-to-the-platform",
  "https://knowledge.neuronsinc.com/how-neurons-attention-prediction",
  "https://knowledge.neuronsinc.com/how-to-run-your-first-prediction",
  "https://knowledge.neuronsinc.com/how-to-use-neurons-ai-benchmarks",
  "https://knowledge.neuronsinc.com/how-to-use-our-help-center-and-ai-support",
  "https://knowledge.neuronsinc.com/how-to-use-predict-benchmarks",
  "https://knowledge.neuronsinc.com/how-to-use-scene-detection-with-neurons-ai-api",
  "https://knowledge.neuronsinc.com/how-to-work-with-aois",
  "https://knowledge.neuronsinc.com/invite-members",
  "https://knowledge.neuronsinc.com/manage-profile-information",
  "https://knowledge.neuronsinc.com/metrics-and-explanations",
  "https://knowledge.neuronsinc.com/move-folders-and-files",
  "https://knowledge.neuronsinc.com/multi-factor-authentication-mfa",
  "https://knowledge.neuronsinc.com/neurons-ai-benchmarks-calculation",
  "https://knowledge.neuronsinc.com/neurons-ai-benchmarks-system",
  "https://knowledge.neuronsinc.com/neurons-ai-heatmaps-and-interpretation",
  "https://knowledge.neuronsinc.com/neurons-ai-in-chrome",
  "https://knowledge.neuronsinc.com/neurons-ai-in-figma",
  "https://knowledge.neuronsinc.com/neurons-ai-metrics-and-explanations",
  "https://knowledge.neuronsinc.com/neurons-ai-plugins",
  "https://knowledge.neuronsinc.com/neurons-ai-scores-and-models",
  "https://knowledge.neuronsinc.com/neurons-avoidance-prediction",
  "https://knowledge.neuronsinc.com/neurons-engagement-prediction",
  "https://knowledge.neuronsinc.com/neurons-intent-prediction",
  "https://knowledge.neuronsinc.com/neurons-memory-prediction",
  "https://knowledge.neuronsinc.com/neurons-trust-prediction",
  "https://knowledge.neuronsinc.com/neuronsai-datasheet",
  "https://knowledge.neuronsinc.com/predict-scores",
  "https://knowledge.neuronsinc.com/rename-folders-and-files",
  "https://knowledge.neuronsinc.com/sign-in-and-out",
  "https://knowledge.neuronsinc.com/understanding-and-working-with-aois",
  "https://knowledge.neuronsinc.com/upload-and-delete-files-to-neurons-ai",
  "https://knowledge.neuronsinc.com/upload-requirements-neurons-ai",
  "https://knowledge.neuronsinc.com/user-roles-and-permissions",
  "https://knowledge.neuronsinc.com/using-vast-ingestion-for-html5-ads",
  "https://knowledge.neuronsinc.com/what-are-the-ai-insights-and-recommendations",
  "https://knowledge.neuronsinc.com/what-are-the-user-roles-and-permissions",
  "https://knowledge.neuronsinc.com/what-is-an-aoi",
  "https://knowledge.neuronsinc.com/working-with-areas-of-interest-aois-in-the-neurons-api"
];

// Types
interface Document {
  id: string;
  url: string;
  indexedAt: string;
  status: 'indexed' | 'failed' | 'pending';
}

interface ExtractedContent {
  status: 'success' | 'error';
  data?: string;
  error?: string;
}

const AdminPanel = () => {
  // State
  const [urls, setUrls] = useState(urlsList);
  const [entityDescription, setEntityDescription] = useState('Extract the main textual content from the url. Remove all navigation bars, ads, sidebars, and unrelated content. Retain only the main article, report, or relevant body text. Format the output as plain text, with paragraphs and subheadings preserved if present. Ensure each chunk starts and ends at logical sentence boundaries and preserves the semantic flow.');
  const [isIndexing, setIsIndexing] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string>();
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [extractedContents, setExtractedContents] = useState<ExtractedContent[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtractContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setIsExtracting(true);

    try {
      const urlList = urls.split('\n')
        .map(url => url.trim())
        .filter(url => url);

      console.log('sending to /api/content-extraction: ' + JSON.stringify({ urls: urlList }))

      const response = await fetch('/api/content-extraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlList, entityDescription }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error('Failed to extract content from response: ', error.error || 'Failed to extract content');
      }

      const result = await response.json();
      setExtractedContents(result.results);

    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleIndex = async (content: ExtractedContent) => {
    if (!content.data || !content.url) return;

    setIsIndexing(prev => ({ ...prev, [content.url]: true }));
    setError(undefined);

    try {
      const response = await fetch('/api/indexing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: [content.url],
          extractedContent: content.data
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to index content');
      }

      const result = await response.json();
      setDocuments(prev => [...prev, ...result.documents]);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsIndexing(prev => ({ ...prev, [content.url]: false }));
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/indexing/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
    }
  };

  const refreshDocuments = async () => {
    try {
      setIsLoadingDocs(true);
      const response = await fetch('/api/indexing');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data.documents);
      setIsLoadingDocs(false);
    } catch (error) {
      console.error('Error refreshing documents:', error);
    }
  };

  // Initial load
  React.useEffect(() => {
    refreshDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Knowledge Scraper Panel</h1>

        <URLManager
          urls={urls}
          entityDescription={entityDescription}
          onUrlsChange={setUrls}
          onEntityDescriptionChange={setEntityDescription}
          onSubmit={handleExtractContent}
          onClear={() => setUrls('')}
          error={error}
          isSubmitting={isExtracting}
        />

        <ExtractedContentResults
          contents={extractedContents}
          isLoading={isExtracting}
          onIndex={handleIndex}
          isIndexing={isIndexing}
        />

        {/* Document List */}
        {isLoadingDocs ? (
          <DocumentListSkeleton />
        ) : (
          <DocumentList
            documents={documents}
            onDelete={handleDeleteDocument}
          />
        )}

      </div>
    </div>
  );
};

export default AdminPanel;