import { Target, Users, ShieldCheck, TrendingUp, Lightbulb, BarChart3 } from "lucide-react"

export interface Indicator {
  id: string
  objectif: string
  indice: string
  cible: string
  resultats: string
  pourcentage: number
  status: "success" | "warning" | "danger"
}

export interface Axe {
  id: string
  title: string
  description: string
  icon: typeof Target
  indicators: Indicator[]
}

export interface KPISummary {
  id: string
  title: string
  value: string
  description: string
  icon: typeof Target
  trend?: "up" | "down" | "stable"
  trendValue?: string
}

export const kpiSummary: KPISummary[] = [
  {
    id: "kpi-1",
    title: "Indicateurs Suivis",
    value: "9",
    description: "Total des indicateurs actifs",
    icon: BarChart3,
    trend: "stable",
  },
  {
    id: "kpi-2",
    title: "Taux de Conformité",
    value: "89%",
    description: "Objectifs atteints",
    icon: ShieldCheck,
    trend: "stable",
  },
  {
    id: "kpi-3",
    title: "Axes Stratégiques",
    value: "3",
    description: "Domaines d'excellence",
    icon: Target,
    trend: "stable",
  },
  {
    id: "kpi-4",
    title: "Performance Globale",
    value: "93%",
    description: "Score moyen pondéré",
    icon: TrendingUp,
    trend: "stable",
  },
]

export const axesData: Axe[] = [
  {
    id: "axe-1",
    title: "Axe 1 – Excellence Opérationnelle",
    description: "Optimisation des processus et amélioration continue",
    icon: TrendingUp,
    indicators: [
      {
        id: "ind-1-1",
        objectif: "Réduire les délais de traitement",
        indice: "Délai moyen de traitement (jours)",
        cible: "≤ 5 jours",
        resultats: "4.2 jours",
        pourcentage: 100,
        status: "success",
      },
      {
        id: "ind-1-2",
        objectif: "Améliorer la qualité des livrables",
        indice: "% de livrables conformes au 1er envoi",
        cible: "≥ 95%",
        resultats: "92%",
        pourcentage: 92,
        status: "warning",
      },
      {
        id: "ind-1-3",
        objectif: "Optimiser l'utilisation des ressources",
        indice: "Taux d'utilisation des équipes",
        cible: "≥ 85%",
        resultats: "88%",
        pourcentage: 88,
        status: "success",
      },
    ],
  },
  {
    id: "axe-2",
    title: "Axe 2 – Développement des Compétences",
    description: "Formation et valorisation du capital humain",
    icon: Users,
    indicators: [
      {
        id: "ind-2-1",
        objectif: "Maintenir et renforcer les compétences internes",
        indice: "% de plan de formation réalisé",
        cible: "≥ 90%",
        resultats: "90%",
        pourcentage: 90,
        status: "success",
      },
      {
        id: "ind-2-2",
        objectif: "Évaluer et fiabiliser le vivier externe",
        indice: "% de profils validés / testés avant mission",
        cible: "100%",
        resultats: "100%",
        pourcentage: 100,
        status: "success",
      },
    ],
  },
  {
    id: "axe-3",
    title: "Axe 3 – Innovation & Amélioration",
    description: "Veille technologique et initiatives d'innovation",
    icon: Lightbulb,
    indicators: [
      {
        id: "ind-3-1",
        objectif: "Promouvoir l'innovation interne",
        indice: "Nombre d'idées soumises / trimestre",
        cible: "≥ 10",
        resultats: "8",
        pourcentage: 80,
        status: "warning",
      },
      {
        id: "ind-3-2",
        objectif: "Déployer des solutions innovantes",
        indice: "% de projets pilotes réussis",
        cible: "≥ 75%",
        resultats: "60%",
        pourcentage: 60,
        status: "danger",
      },
      {
        id: "ind-3-3",
        objectif: "Assurer la veille technologique",
        indice: "Rapports de veille publiés / mois",
        cible: "≥ 2",
        resultats: "3",
        pourcentage: 100,
        status: "success",
      },
    ],
  },
]
