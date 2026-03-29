import { Navbar } from "@/components/sections/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-20 text-center">
          <h1 className="text-4xl font-heading font-bold">Edfu Landing Page</h1>
        </section>
      </main>
    </>
  );
}
