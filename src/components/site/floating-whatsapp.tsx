import { whatsappUrl } from "@/lib/site";
import { getContactContent } from "@/lib/content";

export async function FloatingWhatsapp() {
  const contact = await getContactContent();
  return (
    <div className="floating-whatsapp">
      <div className="floating-whatsapp-label" aria-hidden="true">
        <span>Need Help?</span>
        <strong>Chat with us</strong>
      </div>
      <a
        className="floating-whatsapp-button"
        href={whatsappUrl(contact.whatsappMessage, contact.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat dengan CitraLand Makassar melalui WhatsApp"
      >
        <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
          <path d="M16.04 3A12.8 12.8 0 0 0 5.1 22.43L3 29l6.8-2.04A12.94 12.94 0 1 0 16.04 3Zm0 23.68a10.7 10.7 0 0 1-5.46-1.5l-.39-.23-4.03 1.21 1.24-3.9-.25-.4a10.56 10.56 0 1 1 8.89 4.82Zm5.86-7.92c-.32-.16-1.9-.93-2.2-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.49-2.56-1.57a9.63 9.63 0 0 1-1.78-2.2c-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.7-.97-2.33-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.07 1.3 3.28c.16.21 2.24 3.41 5.42 4.79.76.32 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.77 2.17-1.51.27-.75.27-1.4.19-1.53-.08-.14-.29-.22-.61-.38Z" />
        </svg>
      </a>
    </div>
  );
}
