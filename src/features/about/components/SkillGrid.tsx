import { SKILL_CATEGORIES } from "@/features/about/data/skillsData";

export default function SkillGrid() {
  return (
    <div className="skill-grid">
      {SKILL_CATEGORIES.map((category) => (
        <div key={category.name} className="skill-card pixel-border section-reveal">
          <h3 className="skill-card-title font-pixel">{category.name}</h3>
          <ul className="skill-chips">
            {category.skills.map((skill) => (
              <li key={skill} className="skill-chip font-mono">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
