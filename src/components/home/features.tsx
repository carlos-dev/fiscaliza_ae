import { BarChart3, Lightbulb } from "lucide-react";
import {
  AnalyticsIllustration,
  ComparisonIllustration,
  TransparencyIllustration,
  VotingIllustration,
} from "../illustrations";

interface FeatureWithIllustrationProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const FeatureWithIllustration = ({
  title,
  description,
  icon,
  delay = 0,
}: FeatureWithIllustrationProps) => (
  <div
    className="flex flex-col items-center text-center animate-fadeIn"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="mb-6 transform transition-transform hover:scale-105 duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-medium mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const FeatureCard = ({
  title,
  description,
  icon,
  delay = 0,
}: FeatureWithIllustrationProps) => (
  <div
    className="glass rounded-xl p-6 card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-center mb-4">
      <div className="rounded-full bg-primary/10 p-3 mr-4">{icon}</div>
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Features = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Avalie de forma completa e transparente
          </h2>
          <p className="text-lg text-muted-foreground">
            Utilizamos dados oficiais para criar uma avaliação imparcial do
            desempenho parlamentar
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <FeatureWithIllustration
            title="Dados Transparentes"
            description="Informações extraídas diretamente das fontes oficiais do governo, garantindo credibilidade e transparência na avaliação dos parlamentares."
            icon={<TransparencyIllustration className="w-full h-auto" />}
            delay={0}
          />
          <FeatureWithIllustration
            title="Análise Imparcial"
            description="Nossa metodologia clara e objetiva avalia o desempenho dos parlamentares com base em métricas quantitativas e qualitativas."
            icon={<AnalyticsIllustration className="w-full h-auto" />}
            delay={0.2}
          />
          <FeatureWithIllustration
            title="Comparação Detalhada"
            description="Compare diretamente o desempenho de diferentes parlamentares em diversas categorias para uma análise completa."
            icon={<ComparisonIllustration className="w-full h-auto" />}
            delay={0.4}
          />
          <FeatureWithIllustration
            title="Histórico de Votações"
            description="Acompanhe como cada parlamentar votou em projetos importantes e entenda seu posicionamento político."
            icon={<VotingIllustration className="w-full h-auto" />}
            delay={0.6}
          />
        </div>

        {/* Feature list grid */}
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Dados de Presença"
            description="Verifique a assiduidade dos parlamentares nas sessões e comissões"
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
            delay={0.3}
          />
          <FeatureCard
            title="Gastos Detalhados"
            description="Analise como os parlamentares estão utilizando recursos públicos"
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
            delay={0.4}
          />
          <FeatureCard
            title="Notícias Recentes"
            description="Acompanhe as últimas notícias relacionadas a cada parlamentar"
            icon={<Lightbulb className="h-5 w-5 text-primary" />}
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
