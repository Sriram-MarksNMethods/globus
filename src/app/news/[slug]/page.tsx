import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { news } from "@/content/pages";
import { Footer } from "@/components/layout/Footer";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return news.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = news.posts.find((item) => item.slug === slug);
  return post ? { title: `${post.title} | Globus Developers` } : {};
}

/* One post: title, cover photo, then the article with its section headings. */
export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = news.posts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <main className="bg-white">
      <article className="pt-[110px] pb-[160px] md:pt-[160px]">
        <div className="grid grid-cols-1 gap-5 px-5 md:grid-cols-12">
          <p className="text-small text-grey md:col-span-3">
            <Link href="/news" className="text-black hover:text-grey">
              News and insights
            </Link>
            <br />
            {post.category} · {post.date}
          </p>
          <h1 className="text-h2 md:col-span-8 md:col-start-5">{post.title}</h1>
        </div>

        <div className="relative mx-5 mt-10 aspect-[1400/700] overflow-hidden rounded-[5px]">
          <Image src={post.cover.src} alt={post.cover.alt} fill priority sizes="100vw" className="object-cover" />
        </div>

        <div className="mt-[80px] grid grid-cols-1 gap-5 px-5 md:mt-[120px] md:grid-cols-12">
          <div className="flex flex-col gap-10 md:col-span-6 md:col-start-5">
            {post.body.map((part) => (
              <section key={part.heading}>
                <h2 className="text-h2">{part.heading}</h2>
                {part.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-body mt-4 text-grey">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </article>
      <Footer breadcrumb="News and insights" />
    </main>
  );
}
