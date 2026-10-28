import Image from "next/image";
import Link from "next/link";
import { news } from "@/content/pages";
import { newsTeaser } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

/*
  The latest posts from News and insights, with a link to all of them.
  Three or more posts: the latest three as cards. Fewer: the latest one as a wide feature card
  (photo on the left, title on the right), so the row never looks half empty.
*/
export function NewsTeaser() {
  const latest = news.posts.slice(0, 3);
  const featured = latest.length < 3 ? latest[0] : null;

  return (
    <section className="relative z-10 bg-white pt-[120px] pb-[120px] md:pt-[200px] md:pb-[200px]">
      <SplitHeading parts={news.heading} />

      {featured ? (
        <div className="mt-10 px-5">
          <Link
            href={`/news/${featured.slug}`}
            className="grid grid-cols-1 gap-5 rounded-[5px] bg-soft p-[10px] transition-colors duration-500 hover:bg-chip md:grid-cols-12"
          >
            <div className="relative aspect-[433/240] overflow-hidden rounded-[5px] md:col-span-8">
              <Image src={featured.cover.src} alt={featured.cover.alt} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col pb-[10px] md:col-span-4 md:py-[10px] md:pr-[10px]">
              <p className="text-small text-grey">
                {featured.category} · {featured.date}
              </p>
              <h3 className="text-h2 mt-2">{featured.title}</h3>
            </div>
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-5 px-5 md:grid-cols-3">
          {latest.map((post) => (
            <li key={post.slug}>
              <Link href={`/news/${post.slug}`} className="group flex h-full flex-col rounded-[5px] bg-soft p-[10px] transition-colors duration-500 hover:bg-chip">
                <div className="relative aspect-[433/240] overflow-hidden rounded-[5px]">
                  <Image src={post.cover.src} alt={post.cover.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                </div>
                <p className="text-small mt-4 text-grey">
                  {post.category} · {post.date}
                </p>
                <h3 className="text-h2 mt-2 mb-5">{post.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 px-5">
        <Button href="/news" label={newsTeaser.button} variant="light" className="w-[217px]" />
      </div>
    </section>
  );
}
