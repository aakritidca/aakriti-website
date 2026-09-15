import { getCompanyContent } from "@/lib/data/content";
import { CompanyForm } from "./CompanyForm";

export const metadata = { title: "Company Info" };
export const dynamic = "force-dynamic";

export default async function AdminCompanyPage() {
  const content = await getCompanyContent();

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="text-xl font-semibold text-stone-900 mb-8">Company Information</h1>
      <CompanyForm content={content} />
    </div>
  );
}
