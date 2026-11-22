import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Video, FileText, ChevronDown, ExternalLink } from 'lucide-react';
import Button from '../common/Button';

export function MediaGallerySection({ media = [] }) {
  const { t } = useTranslation();
  const [openTranscripts, setOpenTranscripts] = useState({});

  if (!media || media.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
        <Video className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-600 dark:text-slate-400">
          {t('media_gallery.no_media', 'Media gallery items will appear here.')}
        </p>
      </div>
    );
  }

  const toggleTranscript = (id) => {
    setOpenTranscripts((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {media.map((item) => {
        const isTranscriptOpen = !!openTranscripts[item.id];

        return (
          <article
            key={item.id}
            className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Responsive Video Embed */}
              <div className="relative aspect-video bg-black">
                <iframe
                  src={item.url}
                  title={item.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Video Metadata */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                  <Video className="w-4 h-4" />
                  <span>{t('media_gallery.badge', 'Captioned Video Resource')}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  {item.caption || item.alt_text}
                </p>

                {item.source_credit && (
                  <span className="text-xs text-slate-500 block mb-4">
                    {t('media_gallery.source', 'Source:')} <strong>{item.source_credit}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Transcript Expander (Essential for Deaf / Hard of Hearing Accessibility) */}
            {item.transcript && (
              <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/60">
                <button
                  type="button"
                  onClick={() => toggleTranscript(item.id)}
                  aria-expanded={isTranscriptOpen}
                  aria-controls={`transcript-${item.id}`}
                  className="w-full flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 touch-target focus-visible:outline-none"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>
                      {isTranscriptOpen
                        ? t('media_gallery.hide_transcript', 'Hide Full Text Transcript')
                        : t('media_gallery.read_transcript', 'Read Full Text Transcript')}
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isTranscriptOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isTranscriptOpen && (
                  <div
                    id={`transcript-${item.id}`}
                    role="region"
                    className="mt-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-h-48 overflow-y-auto"
                  >
                    <p className="font-mono whitespace-pre-line">{item.transcript}</p>
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default MediaGallerySection;
