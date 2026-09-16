import { skillGroups, skillsCaveat } from '../config.js'
import Section from './Section.jsx'

export default function Skills() {
  return (
    <Section id="skills" label="Skills" index="02">
      <h2 className="mb-5 text-[clamp(1.75rem,3.6vw,2.5rem)] leading-tight tracking-[-0.015em]">
        What I work with
      </h2>

      <div>
        {skillGroups.map((group) => (
          <div
            key={group.title}
            className="border-t border-line-soft py-6 last:border-b last:border-line-soft"
          >
            <h3 className="mb-3.5 text-[1.0625rem]">{group.title}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 max-w-[62ch] text-sm text-muted">{skillsCaveat}</p>
    </Section>
  )
}
