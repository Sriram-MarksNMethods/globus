import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";

/* Shown for any address that doesn't exist. */
export default function NotFound() {
  return (
    <main className="bg-white">
      <section className="flex min-h-screen flex-col justify-between px-5 pt-[110px] pb-5 md:pt-[160px]">
        <h1 className="text-h1 flex flex-col md:flex-row md:justify-between">
          <span>Page</span>
          <span className="self-end md:self-auto">not found</span>
        </h1>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <p className="text-body max-w-[453px] text-grey">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="flex gap-[10px]">
            <Button href="/" label="Go to homepage" className="w-[217px]" />
            <Button href="/projects" label="Our projects" variant="light" className="w-[217px]" />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
