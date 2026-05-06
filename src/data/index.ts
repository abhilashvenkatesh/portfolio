export interface SkillGroup {
  name: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    name: "Languages",
    items: ["Java", "Node.js", "TypeScript", "JavaScript", "Ruby", "Python"],
  },
  {
    name: "Frameworks",
    items: ["Spring Boot", "Vert.x", "React", "Vue.js", "Express", "Dropwizard", "RxJava"],
  },
  {
    name: "Data & Messaging",
    items: ["MySQL", "MongoDB", "Elasticsearch", "Redis", "Kafka", "DynamoDB", "Cloud Spanner"],
  },
  {
    name: "Cloud & DevOps",
    items: ["AWS", "GCP", "Docker", "Jenkins", "Ansible", "CI/CD", "Microservices"],
  },
];
