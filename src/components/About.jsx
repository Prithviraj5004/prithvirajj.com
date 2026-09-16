import { about } from '../config.js'
import Section from './Section.jsx'

export default function About() {
  return (
    <Section id="about" label="About" index="01">
      <h2 className="mb-5 text-[clamp(1.75rem,3.6vw,2.5rem)] leading-tight tracking-[-0.015em]">
        {about.heading}
      </h2>
      {about.paragraphs.map((text, i) => (
        <p key={i} className="mt-4 max-w-[62ch] text-[1.0625rem] text-muted first:mt-0">
          {text}
        </p>
      ))}
    </Section>
  )
}
