import { prisma } from "@/lib/prisma";

export async function getCompanyContent() {
  let content = await prisma.companyContent.findUnique({ where: { id: "main" } });
  if (!content) {
    content = await prisma.companyContent.create({ data: { id: "main" } });
  }
  return content;
}

export async function getPublishedServices() {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublishedServiceCount() {
  return prisma.service.count({ where: { published: true } });
}
