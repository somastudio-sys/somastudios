import type { ReactNode } from "react";
import { Children, Fragment, isValidElement } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createHeadingIdFactory } from "@/lib/blogHeadings";

type Props = {
  content: string;
  /** Optional React node inserted wherever `{{podcast}}` appears in the markdown. */
  podcastSlot?: ReactNode;
};

function childrenToText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement<{ children?: ReactNode }>(child) && child.props.children) {
        return childrenToText(child.props.children);
      }
      return "";
    })
    .join("");
}

type BlockProps = {
  content: string;
  idForH2: (text: string) => string;
  idForH3: (text: string) => string;
};

function MarkdownBlock({ content, idForH2, idForH3 }: BlockProps) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => {
          const text = childrenToText(children);
          return <h2 id={idForH2(text)}>{children}</h2>;
        },
        h3: ({ children }) => {
          const text = childrenToText(children);
          return <h3 id={idForH3(text)}>{children}</h3>;
        },
        a: ({ href, children }) => {
          const external = href?.startsWith("http");
          return (
            <a
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
}

export default function MarkdownArticle({ content, podcastSlot }: Props) {
  const parts = content.split(/\{\{\s*podcast\s*\}\}/i);
  const idForH2 = createHeadingIdFactory();
  const idForH3 = createHeadingIdFactory();

  return (
    <div className="blog-article-prose">
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part.trim() ? (
            <MarkdownBlock
              content={part}
              idForH2={idForH2}
              idForH3={idForH3}
            />
          ) : null}
          {index < parts.length - 1 ? podcastSlot : null}
        </Fragment>
      ))}
    </div>
  );
}
