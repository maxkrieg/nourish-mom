const features = [
  {
    title: 'Made for recovery',
    description:
      'Every meal is designed with postpartum nutrition in mind, supporting healing and breastfeeding.',
  },
  {
    title: 'Flexible delivery',
    description:
      'Daily, a few times a week, or weekly — you choose what fits your life.',
  },
  {
    title: 'One less thing to think about',
    description:
      'New parenthood is overwhelming. Let us handle the cooking.',
  },
]

export default function WhyNourishMom() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1120px] px-6 lg:px-10">
        <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight text-neutral-text">
          Why Nourish Mom
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="mb-3 text-lg font-semibold text-neutral-text">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-neutral-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
