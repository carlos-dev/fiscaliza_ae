import SearchBar from "@/components/search-bar";
import { ArrowRight, ChevronRight, Scale } from "lucide-react";
// import { api } from "@/utils/api";
import Link from "next/link";
import Navigation from "@/components/navigation";
import { WavyBackground } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import ParliamentaryRanking from "@/components/home/parliamentary-ranking";
import Features from "@/components/home/features";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {/* Hero Section with enhanced styling */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMjMyMzIiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0zaDF2NGgtMXYtNHptLTUtMWg0djFoLTR2LTF6bTAgM2gxdjRoLTF2LTR6bS01LTFoNHYxaC00di0xem0wIDNoMXY0aC0xdi00em0tNS0xaDR2MWgtNHYtMXptMCAzaDF2NGgtMXYtNHptLTUtMWg0djFoLTR2LTF6bTAgM2gxdjRoLTF2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 -z-10"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block animate-float mb-6">
              <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10">
                <Scale className="h-10 w-10 text-primary" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fadeIn bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Avalie seus representantes
            </h1>
            <p
              className="text-xl text-muted-foreground mb-10 md:mb-12 animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              Descubra como deputados e senadores estão atuando em nome do povo
              brasileiro
            </p>

            <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              <SearchBar variant="large" />
            </div>

            <div
              className="mt-8 flex flex-wrap justify-center gap-4 animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href="/ranking"
                className="px-6 py-3 text-sm font-medium rounded-full border border-primary bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <span className="flex items-center">
                  Ver ranking completo
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/compare"
                className="px-6 py-3 text-sm font-medium rounded-full border border-primary bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <span className="flex items-center">
                  Comparar parlamentares
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 text-primary">
          <WavyBackground />
        </div>
      </section>

      {/* Rankings Section */}
      <ParliamentaryRanking />

      {/* Features Section */}
      <Features />

      {/* Call to Action with enhanced styling */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-0 right-0 w-60 h-60 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white/80 dark:bg-black/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8">
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold mb-6">
                Comece a avaliar seus representantes agora
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Busque por nome, partido ou estado e descubra como seus
                representantes estão trabalhando para você e para o Brasil
              </p>

              <SearchBar variant="large" className="max-w-2xl mx-auto" />

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button asChild variant="default" className="group">
                  <Link href="/ranking">
                    Ver ranking completo
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
