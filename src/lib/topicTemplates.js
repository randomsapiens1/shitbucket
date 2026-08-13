import WorkoutLogSection from "@/components/detail/templates/WorkoutLogSection";

const TOPIC_TEMPLATES = {
  workout: WorkoutLogSection,
};

export function getTopicTemplate(topic) {
  if (!topic) return null;
  return TOPIC_TEMPLATES[topic.trim().toLowerCase()] || null;
}
