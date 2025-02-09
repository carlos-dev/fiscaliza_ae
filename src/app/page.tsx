import { Search } from "@/components/search";

export default function Home() {
  return (
    <div className="dark bg-zinc-900 min-h-screen p-4">
      <header>
        <span className="text-white text-2xl logo">Fiscaliza ae</span>
      </header>
      <h2 className="text-white text-3xl text-center">
        Veja se o político quem voltou ta trabalhando direitinho ou é um pé
        rapado
      </h2>

      <Search />
    </div>
  );
}
