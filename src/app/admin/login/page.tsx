import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Staff Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-950 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-serif text-2xl text-white mb-1.5">Aakriti CMS</div>
          <p className="text-stone-400 text-sm">Sign in to manage your website content</p>
        </div>
        <div className="bg-white p-8">
          <LoginForm callbackUrl={callbackUrl || "/admin"} />
        </div>
      </div>
    </div>
  );
}
