import { headingId } from "@/lib/content";

type Block = { type: string; text: string };

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  const content: React.ReactNode[] = [];
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    if (block.type === "li") {
      const list: string[] = [];
      while (index < blocks.length && blocks[index].type === "li")
        list.push(blocks[index++].text);
      content.push(
        <ul key={`list-${index}`}>
          {list.map((text, item) => (
            <li key={item}>{text}</li>
          ))}
        </ul>,
      );
      index--;
    } else if (block.type === "h2") {
      content.push(
        <h2 id={headingId(block.text)} key={index}>
          {block.text}
        </h2>,
      );
    } else if (block.type === "h3") {
      content.push(
        <h3 id={headingId(block.text)} key={index}>
          {block.text}
        </h3>,
      );
    } else if (block.type === "p") {
      content.push(<p key={index}>{block.text}</p>);
    }
  }
  return <div className="article-prose">{content}</div>;
}
