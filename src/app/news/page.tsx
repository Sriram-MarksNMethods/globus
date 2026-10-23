import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { news } from "@/content/pages";
import { PlusIcon } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "News and insights | Globus Developers",
  description: "Market insights and news from Globus Developers.",
};

/* News: split headline, then a 3-column grid of grey post cards. */
export default function NewsPage() {
  return (
    <main className="bg-white">
      <section className="pt-[110px] pb-[160px] md:pt-[160px]">
        <h1 className="text-h1 flex flex-col px-5 md:flex-row md:justify-between">
          <span>{news.heading[0]}</span>
          <span className="self-end md:self-auto">{news.heading[1]}</span>
        </h1>

        <ul className="mt-10 grid grid-cols-1 gap-5 px-5 md:grid-cols-3">
          {news.posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/news/${post.slug}`} className="group flex h-full flex-col rounded-[5px] bg-soft p-[10px] transition-colors duration-500 hover:bg-chip">
                <div className="relative aspect-[433/240] overflow-hidden rounded-[5px]">
                  <Image src={post.cover.src} alt={post.cover.alt} fill sizes="33vw" className="object-cover" />
                </div>
                <p className="text-body mt-4 px-[10px]">{post.title}</p>
                <div className="mt-auto flex items-end justify-between px-[10px] pt-[60px] pb-[6px]">
                  <p className="text-small text-grey">
                    {post.category} · {post.date}
                  </p>
                  <span className="flex size-[30px] items-center justify-center rounded-[5px] bg-white">
                    <PlusIcon />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Footer breadcrumb="News and insights" />
    </main>
  );
}
