import { currentlyLearning } from '../config.js'
import Section from './Section.jsx'

export default function CurrentlyLearning() {
  return (
    <Section id="learning" label="Currently learning" index="03">
      <h2 className="mb-5 text-[clamp(1.75rem,3.6vw,2.5rem)] leading-tight tracking-[-0.015em]">
        An open roadmap
      </h2>
      <p className="mb-8 max-w-[62ch] text-[1.0625rem] text-muted">
        What I'm focused on right now. It moves around a lot, which feels about right for this
        stage.
      </p>

      <ol className="m-0 list-none border-l border-line p-0">
        {currentlyLearning.map((item) => (
          <li key={item.label} className="group relative pb-6 pl-7 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute left-[-4.5px] top-[0.65rem] h-2 w-2 rounded-full border border-accent bg-bg transition-colors duration-300 ease-soft group-hover:bg-accent"
            />
            <span className="font-serif text-[1.0625rem]">{item.label}</span>
            <span className="mt-0.5 block text-sm text-muted">{item.note}</span>
          </li>
        ))}
      </ol>
    </Section>
  )
}
