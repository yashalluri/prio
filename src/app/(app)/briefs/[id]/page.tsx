import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BriefContent } from "@/components/brief-content";

export default async function BriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { id } = await params;
  const brief = await prisma.brief.findFirst({
    where: { id, userId: user.id },
  });

  if (!brief) notFound();

  const content = (brief.content as Record<string, unknown>) ?? {};

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-4" asChild>
          <Link href="/briefs">
            <ArrowLeft className="mr-1.5 size-3.5" />
            Back to Briefs
          </Link>
        </Button>
      </div>
      <BriefContent
        title={brief.title}
        content={content}
        status={brief.status}
        updatedAt={brief.updatedAt}
      />
    </div>
  );
}
