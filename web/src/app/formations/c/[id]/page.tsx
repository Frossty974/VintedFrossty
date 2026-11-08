import type { Metadata } from "next";
import { CommunityCoursePage } from "@/components/community/CommunityCoursePage";

export const metadata: Metadata = { title: "Formation de la communauté" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CommunityCoursePage id={id} />;
}
