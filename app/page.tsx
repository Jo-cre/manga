"use client";
import Topbar from "@/components/Topbar";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Topbar />
      <section className="mt-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Manga App</h1>
        <p className="mb-4">
          This is a sample home page. Use the top bar to navigate through the
          app.
        </p>
      </section>
    </div>
  );
}
