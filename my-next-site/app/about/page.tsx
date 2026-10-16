import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">关于我们</h1>
      <p>这是 /about 页面，App Router 文件夹路由演示</p>
      <p>路由由文件夹名称自动生成，不需要手动配置路由表！</p>
      <div className="mt-6">
        <Link href="/" className="text-blue-600 underline">
          返回首页
        </Link>
      </div>
    </main>
  );
}