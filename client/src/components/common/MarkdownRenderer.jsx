import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * Strips markdown syntax (headers, asterisks, bullet dashes, links)
 * so screen readers and Web Speech API speak clean, natural language.
 */
export function cleanMarkdownForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/^#{1,6}\s+/gm, '') // Remove # headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **bold**
    .replace(/\*([^*]+)\*/g, '$1') // Remove *italic*
    .replace(/__([^_]+)__/g, '$1') // Remove __bold__
    .replace(/_([^_]+)_/g, '$1') // Remove _italic_
    .replace(/`([^`]+)`/g, '$1') // Remove `code`
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Keep link text only
    .replace(/^[-*+]\s+/gm, '') // Remove bullet dashes
    .replace(/^\d+\.\s+/gm, '') // Remove numbered prefixes
    .replace(/\n{2,}/g, '. ') // Turn paragraph breaks into natural speech pauses
    .trim();
}

/**
 * Parses inline formatting: **bold**, *italic*, `code`, and [link](url).
 */
function renderInline(text, keyPrefix = '') {
  if (!text) return null;

  // Regex matches **bold**, *italic*, `code`, [text](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let idx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-inline-${idx++}`;

    if (token.startsWith('**') && token.endsWith('**')) {
      const inner = token.slice(2, -2);
      // Check for Myth or Fact labels to render stylized badges
      if (/^Myth\s*:?/i.test(inner)) {
        parts.push(
          <span key={key} className="inline-flex items-center gap-1">
            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-extrabold text-xs uppercase tracking-wider mr-1 border border-rose-300 dark:border-rose-800">
              Myth
            </span>
            <strong className="font-bold text-slate-900 dark:text-slate-100">
              {inner.replace(/^Myth\s*:?\s*/i, '')}
            </strong>
          </span>
        );
      } else if (/^Fact\s*:?/i.test(inner)) {
        parts.push(
          <span key={key} className="inline-flex items-center gap-1">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-wider mr-1 border border-emerald-300 dark:border-emerald-800">
              Fact
            </span>
            <strong className="font-bold text-slate-900 dark:text-slate-100">
              {inner.replace(/^Fact\s*:?\s*/i, '')}
            </strong>
          </span>
        );
      } else {
        parts.push(
          <strong key={key} className="font-bold text-slate-900 dark:text-slate-100">
            {inner}
          </strong>
        );
      }
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={key} className="italic text-slate-800 dark:text-slate-200">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={key} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-xs border border-slate-200 dark:border-slate-700">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      const splitIdx = token.indexOf('](');
      const linkText = token.slice(1, splitIdx);
      const linkUrl = token.slice(splitIdx + 2, -1);
      parts.push(
        <a
          key={key}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold inline-flex items-center gap-0.5"
        >
          <span>{linkText}</span>
          <ExternalLink className="w-3 h-3 inline-block" />
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * Accessible Markdown renderer that converts raw markdown (#, ##, ###, **, -, 1.)
 * into properly structured, beautiful, high-contrast HTML with zero raw syntax characters.
 */
export function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let currentList = null;
  let blockIdx = 0;

  const flushList = () => {
    if (!currentList) return;
    const key = `list-${blockIdx++}`;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={key} className="space-y-2.5 my-3 pl-1">
          {currentList.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200 leading-relaxed text-base">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0" aria-hidden="true" />
              <div className="flex-1">{renderInline(item, `li-${i}`)}</div>
            </li>
          ))}
        </ul>
      );
    } else if (currentList.type === 'ol') {
      elements.push(
        <ol key={key} className="space-y-3 my-3 pl-1">
          {currentList.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-200 leading-relaxed text-base">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1">{renderInline(item, `ol-${i}`)}</div>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Empty line separates blocks
    if (!trimmed) {
      flushList();
      continue;
    }

    // Header 1 (# ...)
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={`h1-${blockIdx++}`} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-6 mb-3">
          {renderInline(trimmed.slice(2), `h1-${i}`)}
        </h2>
      );
    }
    // Header 2 (## ...)
    else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h2-${blockIdx++}`} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2.5 border-b pb-1 border-slate-200 dark:border-slate-800">
          {renderInline(trimmed.slice(3), `h2-${i}`)}
        </h3>
      );
    }
    // Header 3 (### ...)
    else if (trimmed.startsWith('### ')) {
      flushList();
      const headingText = trimmed.slice(4);
      // Check if numbered like "### 1. Screen Readers"
      const numberedMatch = headingText.match(/^(\d+)\.\s*(.*)$/);
      if (numberedMatch) {
        elements.push(
          <h4 key={`h3-${blockIdx++}`} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {numberedMatch[1]}
            </span>
            <span>{renderInline(numberedMatch[2], `h3-${i}`)}</span>
          </h4>
        );
      } else {
        elements.push(
          <h4 key={`h3-${blockIdx++}`} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2 text-blue-900 dark:text-blue-300">
            {renderInline(headingText, `h3-${i}`)}
          </h4>
        );
      }
    }
    // Bullet list item (- ... or * ...)
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(trimmed.slice(2));
    }
    // Numbered list item (1. ...)
    else if (/^\d+\.\s/.test(trimmed)) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(trimmed.replace(/^\d+\.\s*/, ''));
    }
    // Standard paragraph
    else {
      flushList();
      elements.push(
        <p key={`p-${blockIdx++}`} className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          {renderInline(trimmed, `p-${i}`)}
        </p>
      );
    }
  }

  flushList();

  return <div className={`markdown-content ${className}`}>{elements}</div>;
}

export default MarkdownRenderer;
