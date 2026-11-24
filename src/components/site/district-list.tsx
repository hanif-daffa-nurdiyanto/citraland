import { getDistricts } from "@/lib/content";
import { DistrictCard } from "./cards";
import { SectionHeading } from "./section-heading";

export async function DistrictList({ current }: { current?: string }) {
  const districts = await getDistricts();
  const shown = districts.filter((district) => district.slug !== current);
  return (
    <section className="section districts-section">
      <div className="site-container">
        <SectionHeading
          eyebrow="3 Kawasan Premium"
          title="Pilih Kawasan Favorit Anda"
        />
        <div className="district-grid">
          {shown.map((district) => (
            <DistrictCard
              key={district.slug}
              title={district.title}
              image={district.cardImage}
              href={`/${district.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
