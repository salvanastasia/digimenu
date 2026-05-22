import { ClientMenuPage } from "@/components/ClientMenuPage";

type ClientPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ClientPage({ params }: ClientPageProps) {
  const { slug } = await params;
  return <ClientMenuPage slug={slug} />;
}
