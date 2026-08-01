import type { Metadata } from "next";
import { headers } from "next/headers";
import { isColoradoExperience } from "@/lib/coloradoTheme";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const pathname = headersList.get("x-pathname") ?? "/contact";
  const params = new URLSearchParams();
  if (headersList.get("x-co-contact") === "1") {
    params.set("co", "1");
  }
  const isColorado = isColoradoExperience(host, pathname, params);

  if (isColorado) {
    return {
      title: "Contact — BMX Colorado",
      description:
        "Contact BMX Colorado about the statewide forum, track boards, or community questions.",
    };
  }

  return {
    title: "Contact",
    description:
      "Get in touch with DEN BMX. Contact us for questions about Denver metro BMX tracks, events, or volunteering opportunities.",
  };
}

export default function ContactLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}
