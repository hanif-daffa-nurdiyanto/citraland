import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingWhatsapp } from "@/components/site/floating-whatsapp";
import { getDistricts } from "@/lib/content";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const districts = await getDistricts();
  return (
    <>
      <Header districts={districts} />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsapp />
    </>
  );
}
