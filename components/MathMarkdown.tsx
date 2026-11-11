import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Renders text with KaTeX math formulas ($$...$$ and $...$),
 * code blocks, inline code, bold, and italic formatting.
 */
export const MathMarkdown: React.FC<MathMarkdownProps> = ({ content, className = '' }) => {
  const renderKaTeX = (expr: string, displayMode: boolean, key: string) => {
    try {
      const html = katex.renderToString(expr.trim(), {
        displayMode,
        throwOnError: false,
        strict: false,
      });
      if (displayMode) {
        return (
          <div
            key={key}
            className="my-2 px-3 py-2 rounded-xl bg-slate-950/40 dark:bg-black/40 border border-slate-700/40 overflow-x-auto text-center"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }
      return (
        <span
          key={key}
          className="inline-block align-middle mx-0.5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      return (
        <code key={key} className="font-mono text-xs px-1 rounded bg-slate-800/40">
          {expr}
        </code>
      );
    }
  };

  // Parse inline formatting (bold, italic, inline code, inline math $...$)
  const renderInline = (text: string, prefixKey: string): React.ReactNode[] => {
    const tokenRegex = /(\$[^$\n]+\$|`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let partIdx = 0;

    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(text.slice(lastIndex, match.index));
      }
      const token = match[0];
      const key = `${prefixKey}-tok-${partIdx++}`;

      if (token.startsWith('$') && token.endsWith('$')) {
        nodes.push(renderKaTeX(token.slice(1, -1), false, key));
      } else if (token.startsWith('`') && token.endsWith('`')) {
        nodes.push(
          <code
            key={key}
            className="px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-primary-700 dark:text-cyan-300 font-mono text-[11px]"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('**') && token.endsWith('**')) {
        nodes.push(
          <strong key={key} className="font-extrabold">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        nodes.push(
          <em key={key} className="italic opacity-90">
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }
    return nodes;
  };

  // Split by fenced code blocks ```...``` and display math $$...$$ first
  const blockRegex = /(```[\s\S]*?```|\$\$[\s\S]*?\$\$)/g;
  const blocks: React.ReactNode[] = [];
  let lastIdx = 0;
  let blockMatch: RegExpExecArray | null;
  let blockIdx = 0;

  while ((blockMatch = blockRegex.exec(content)) !== null) {
    if (blockMatch.index > lastIdx) {
      const plainSegment = content.slice(lastIdx, blockMatch.index);
      blocks.push(
        <span key={`seg-${blockIdx++}`} className="whitespace-pre-wrap">
          {renderInline(plainSegment, `seg-${blockIdx}`)}
        </span>
      );
    }

    const token = blockMatch[0];
    const key = `blk-${blockIdx++}`;

    if (token.startsWith('$$') && token.endsWith('$$')) {
      blocks.push(renderKaTeX(token.slice(2, -2), true, key));
    } else if (token.startsWith('```') && token.endsWith('```')) {
      const lines = token.slice(3, -3).split('\n');
      const lang = lines[0]?.trim() || 'code';
      const codeBody = lines.length > 1 ? lines.slice(1).join('\n') : lines[0];
      blocks.push(
        <div key={key} className="my-2 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 text-slate-100">
          <div className="px-3 py-1 bg-slate-900 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            {lang}
          </div>
          <pre className="p-3 overflow-x-auto text-[11px] font-mono leading-relaxed">
            <code>{codeBody}</code>
          </pre>
        </div>
      );
    }

    lastIdx = blockRegex.lastIndex;
  }

  if (lastIdx < content.length) {
    const tail = content.slice(lastIdx);
    blocks.push(
      <span key={`seg-tail`} className="whitespace-pre-wrap">
        {renderInline(tail, 'tail')}
      </span>
    );
  }

  return <div className={`leading-relaxed space-y-1 ${className}`}>{blocks}</div>;
};

export default MathMarkdown;
