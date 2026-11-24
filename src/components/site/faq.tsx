import { SectionHeading } from "./section-heading";

export type FaqItem = { question: string; answer: string };

export function Faq({
  items,
  title = "Frequently Asked Questions",
}: {
  items: FaqItem[];
  title?: string;
}) {
  return (
    <section className="section faq-section">
      <div className="site-container faq-layout">
        <SectionHeading eyebrow="Pertanyaan umum" title={title} />
        <div className="faq-list">
          {items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
