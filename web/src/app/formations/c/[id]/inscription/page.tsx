import type { Metadata } from "next";
import { CommunityEnrollPage } from "@/components/community/CommunityCoursePage";

export const metadata: Metadata = { title: "Inscription", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CommunityEnrollPage id={id} />;
}
