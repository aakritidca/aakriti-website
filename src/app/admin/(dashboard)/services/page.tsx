import { prisma } from "@/lib/prisma";
import { ServicesManager } from "./ServicesManager";

export const metadata = { title: "Services" };
export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return <ServicesManager initialServices={services} />;
}
