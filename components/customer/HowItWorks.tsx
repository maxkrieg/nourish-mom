const steps = [
  {
    number: '1',
    title: 'Choose your meals',
    description:
      'Browse our postpartum-friendly menu and pick what sounds good.',
  },
  {
    number: '2',
    title: 'Set your schedule',
    description:
      "Tell us how often and how long you'd like deliveries.",
  },
  {
    number: '3',
    title: 'We deliver to you',
    description:
      'Fresh meals arrive at your door on your chosen schedule.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-teal-light py-16">
      <div className="mx-auto max-w-[1120px] px-6 lg:px-10">
        <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight text-neutral-text">
          How It Works
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-lg font-bold text-white">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-neutral-text">
                {step.title}
              </h3>
              <p className="leading-relaxed text-neutral-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
