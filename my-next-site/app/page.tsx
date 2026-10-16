import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">我的Next网站首页</h1>
      <p>项目准备部署到Vercel</p>
      <div className="mt-6">
        <Link href="/about" className="text-blue-600 underline">
          前往 About 页面
        </Link>
      </div>
    </main>
  );
}