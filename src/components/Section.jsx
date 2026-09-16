import Reveal from './Reveal.jsx'

/**
 * One page section: a small label on the left (desktop), content on the right.
 * `index` is the section's position in the page, shown next to the label.
 */
export default function Section({ id, label, index, children }) {
  return (
    <section id={id} className="py-16 sm:py-24 lg:py-28">
      <div className="wrap">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-[11rem_1fr] md:gap-14">
            <div className="section-label">
              <span className="mr-2 font-serif text-xs opacity-70">{index}</span>
              {label}
            </div>
            <div>{children}</div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
