/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import { codeToHtml } from "shiki";
import type { NotionBlock, RichText } from "@/lib/types";

type NotionRendererProps = {
  blocks: NotionBlock[];
};

export default async function NotionRenderer({ blocks }: NotionRendererProps) {
  const rendered = await Promise.all(blocks.map(renderBlock));

  return <div className="space-y-6">{rendered}</div>;
}

async function renderBlock(block: NotionBlock): Promise<ReactNode> {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={block.id} className="text-base leading-8 text-body">
          {renderRichText(block.richText)}
        </p>
      );
    case "heading_1":
      return renderHeadingBlock(block, 1);
    case "heading_2":
      return renderHeadingBlock(block, 2);
    case "heading_3":
      return renderHeadingBlock(block, 3);
    case "bulleted_list_item":
      return (
        <div key={block.id} className="flex gap-3 text-base leading-8 text-body">
          <span className="mt-0.5 text-accent">-</span>
          <div>{renderRichText(block.richText)}</div>
        </div>
      );
    case "numbered_list_item":
      return (
        <div key={block.id} className="flex gap-3 text-base leading-8 text-body">
          <span className="mt-0.5 text-accent">#</span>
          <div>{renderRichText(block.richText)}</div>
        </div>
      );
    case "code":
      return renderCodeBlock(block);
    case "toggle":
      return renderToggleBlock(block);
    case "table":
      return renderTableBlock(block);
    case "table_row":
      return null;
    case "quote":
      return (
        <blockquote
          key={block.id}
          className="border-l-2 border-accent/60 pl-5 text-base leading-8 text-body"
        >
          {renderRichText(block.richText)}
        </blockquote>
      );
    case "divider":
      return <hr key={block.id} className="border-border" />;
    case "image":
      return block.url ? (
        <img
          key={block.id}
          src={block.url}
          alt=""
          className="w-full border border-border object-cover"
        />
      ) : null;
    case "unsupported":
      return null;
    default:
      return process.env.NODE_ENV === "development" ? (
        <p key={block.id} className="text-sm text-muted">
          Unsupported Notion block: {block.type}
        </p>
      ) : null;
  }
}

async function renderHeadingBlock(block: NotionBlock, level: 1 | 2 | 3) {
  const children = block.children ? await Promise.all(block.children.map(renderBlock)) : [];
  const className = headingClass(level);
  const content = renderRichText(block.richText);

  if (children.length > 0 || block.isToggleable) {
    return (
      <details key={block.id} open className="border-b border-border pb-4">
        <summary className="cursor-pointer marker:text-accent">
          <span className={className}>{content}</span>
        </summary>
        {children.length > 0 ? (
          <div className="mt-5 space-y-5 border-l border-border pl-4">{children}</div>
        ) : null}
      </details>
    );
  }

  if (level === 1) {
    return (
      <h1 key={block.id} className={className}>
        {content}
      </h1>
    );
  }

  if (level === 2) {
    return (
      <h2 key={block.id} className={className}>
        {content}
      </h2>
    );
  }

  return (
    <h3 key={block.id} className={className}>
      {content}
    </h3>
  );
}

async function renderToggleBlock(block: NotionBlock) {
  const children = block.children ? await Promise.all(block.children.map(renderBlock)) : [];
  const label = textFromRichText(block.richText) ? renderRichText(block.richText) : "Details";

  return (
    <details key={block.id} className="border border-border bg-surface p-4">
      <summary className="cursor-pointer text-base leading-7 text-foreground marker:text-accent">
        {label}
      </summary>
      {children.length > 0 ? (
        <div className="mt-4 space-y-5 border-t border-border pt-4">{children}</div>
      ) : null}
    </details>
  );
}

function headingClass(level: 1 | 2 | 3) {
  if (level === 1) {
    return "mono-heading inline text-3xl font-semibold text-foreground";
  }

  if (level === 2) {
    return "mono-heading inline text-2xl font-semibold text-foreground";
  }

  return "mono-heading inline text-xl font-semibold text-foreground";
}

function renderTableBlock(block: NotionBlock) {
  const rows = (block.children ?? []).filter(
    (child) => child.type === "table_row" && child.cells && child.cells.length > 0,
  );

  if (rows.length === 0) {
    return null;
  }

  return (
    <div key={block.id} className="overflow-x-auto border border-border">
      <table className="w-full min-w-[520px] border-collapse bg-code text-sm text-body">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id} className="border-b border-border last:border-b-0">
              {row.cells?.map((cell, cellIndex) =>
                block.hasColumnHeader && rowIndex === 0 ? (
                  <th
                    key={`${row.id}-${cellIndex}`}
                    className="border-r border-border bg-surface px-3 py-2 text-left font-medium text-foreground last:border-r-0"
                  >
                    {renderRichText(cell)}
                  </th>
                ) : (
                  <td
                    key={`${row.id}-${cellIndex}`}
                    className="border-r border-border px-3 py-2 align-top last:border-r-0"
                  >
                    {renderRichText(cell)}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function renderCodeBlock(block: NotionBlock) {
  const language = block.language ?? "text";
  const code = textFromRichText(block.richText);
  let html: string;

  try {
    html = await codeToHtml(code, {
      lang: language,
      theme: "github-dark-default",
    });
  } catch {
    html = `<pre><code>${escapeHtml(code)}</code></pre>`;
  }

  return (
    <div key={block.id} className="relative overflow-hidden border border-border bg-code">
      <span className="absolute right-3 top-2 z-10 text-xs text-muted">{language}</span>
      <div
        className="overflow-x-auto [&_pre]:!m-0 [&_pre]:!bg-code [&_pre]:!p-4 [&_pre]:!pt-8 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-7"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function renderRichText(parts: RichText[] = []) {
  return parts.map((part, index) => {
    let node: ReactNode = part.plainText;

    if (part.code) {
      node = (
        <code className="border border-border bg-code px-1 py-0.5 font-mono text-sm text-accent">
          {node}
        </code>
      );
    }

    if (part.bold) {
      node = <strong className="font-semibold text-foreground">{node}</strong>;
    }

    if (part.italic) {
      node = <em>{node}</em>;
    }

    if (part.href) {
      node = (
        <a
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4"
        >
          {node}
        </a>
      );
    }

    return <span key={`${part.plainText}-${index}`}>{node}</span>;
  });
}

function textFromRichText(parts: RichText[] = []) {
  return parts.map((part) => part.plainText).join("");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
