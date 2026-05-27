export interface CampaignItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  raised: number;
  goal: number;
  imageSrc: string;
  accentClass: string;
  progressColor: string;
  status: "active" | "completed" | "paused";
}

export const CAMPAIGNS: CampaignItem[] = [
  {
    id: "1",
    slug: "green-canopy-project",
    title: "Green Canopy Project",
    category: "Environment",
    description: "Our target is planting 20,000 native saplings in Bankura to establish organic corridors. Funds will be used for sapling purchase, fencing, and compost.",
    fullDescription: "The Green Canopy Project is our flagship environmental initiative aimed at reforesting degraded lands across the Bankura district of West Bengal. With a target of planting 20,000 native saplings, this project creates organic green corridors that combat soil erosion, improve air quality, and restore habitats for local wildlife. Funds directly support sapling procurement from certified nurseries, protective fencing, organic compost, and ongoing maintenance by local volunteer teams.",
    raised: 325000,
    goal: 500000,
    imageSrc: "/Assets/Basic_Workflow.png",
    accentClass: "text-primary-900",
    progressColor: "bg-primary-900",
    status: "active",
  },
  {
    id: "2",
    slug: "sakti-blood-directory",
    title: "Sakti Blood Directory",
    category: "Healthcare",
    description: "Developing a custom web dashboard to match emergency donors with local hospital units in real-time, coupled with conducting 10 local weekend donation camps.",
    fullDescription: "The Sakti Blood Directory combines technology with grassroots healthcare to address blood shortages in West Bengal. We are building a real-time donor matching platform that connects emergency blood requests with verified volunteer donors in their vicinity. Alongside the tech platform, we conduct regular weekend blood donation camps at schools, colleges, and community centers. Every rupee donated helps maintain the digital infrastructure and fund camp logistics.",
    raised: 185000,
    goal: 300000,
    imageSrc: "/Assets/Ecosystems.png",
    accentClass: "text-alert-500",
    progressColor: "bg-alert-500",
    status: "active",
  },
  {
    id: "3",
    slug: "sakti-scholar-centers",
    title: "Sakti Scholar Centers",
    category: "Education",
    description: "Setting up modern learning centers in disadvantaged communities, equipped with books, tablets, and volunteer teachers to support homework studies.",
    fullDescription: "Sakti Scholar Centers establish safe, modern learning spaces in underserved communities where children lack access to educational resources. Each center is equipped with books, tablets loaded with educational content, and staffed by trained volunteer teachers. The program focuses on homework support, digital literacy, English language skills, and creative arts. Your donation covers rent, equipment, learning materials, and volunteer stipends.",
    raised: 150000,
    goal: 400000,
    imageSrc: "/Assets/Workflows.png",
    accentClass: "text-accent-600",
    progressColor: "bg-accent-500",
    status: "active",
  },
  {
    id: "4",
    slug: "community-sanitation-drive",
    title: "Community Sanitation Drive",
    category: "Environment",
    description: "Organizing neighborhood cleanups, installing public waste bins, and conducting hygiene awareness campaigns in rural and semi-urban areas.",
    fullDescription: "Our Community Sanitation Drive tackles waste management and public hygiene in rural and semi-urban areas. The initiative includes regular neighborhood cleanup events, installation of segregated waste bins, distribution of reusable bags, and door-to-door hygiene awareness campaigns. We work with local schools and panchayats to ensure long-term sustainability of sanitation improvements.",
    raised: 95000,
    goal: 200000,
    imageSrc: "/Assets/st_michale_01.png",
    accentClass: "text-primary-700",
    progressColor: "bg-primary-700",
    status: "active",
  },
  {
    id: "5",
    slug: "youth-mentorship-program",
    title: "Youth Mentorship Program",
    category: "Education",
    description: "Connecting experienced professionals with young students for career guidance, skill development, and personal growth mentoring sessions.",
    fullDescription: "The Youth Mentorship Program pairs college students and young professionals with school students from underserved communities. Mentors provide career guidance, study skills support, and personal development coaching through monthly in-person sessions and weekly online check-ins. The program aims to build confidence, expand horizons, and create pathways to higher education and employment.",
    raised: 80000,
    goal: 250000,
    imageSrc: "/Assets/st_peters_01.png",
    accentClass: "text-warning-500",
    progressColor: "bg-warning-500",
    status: "active",
  },
  {
    id: "6",
    slug: "emergency-response-network",
    title: "Emergency Response Network",
    category: "Healthcare",
    description: "Building a trained volunteer network for disaster relief, medical emergencies, and rapid community response across West Bengal.",
    fullDescription: "The Emergency Response Network trains volunteer teams in first aid, disaster preparedness, and rapid community mobilization. Each team is equipped with basic medical supplies, communication devices, and emergency kits. The network coordinates with local hospitals, fire departments, and police to provide rapid response during natural disasters, medical emergencies, and community crises.",
    raised: 210000,
    goal: 350000,
    imageSrc: "/Assets/narayana_01.png",
    accentClass: "text-alert-500",
    progressColor: "bg-alert-500",
    status: "active",
  },
];
