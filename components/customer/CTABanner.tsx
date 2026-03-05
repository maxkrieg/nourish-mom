import Link from 'next/link'

export default function CTABanner() {
  return (
    <section className="bg-teal py-16">
      <div className="mx-auto max-w-[1120px] px-6 text-center lg:px-10">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">
          Ready to feel nourished?
        </h2>
        <p className="mb-8 text-lg leading-relaxed text-white/80">
          Join Nourish Mom and get meals delivered starting this week.
        </p>
        <Link
          href="/register"
          className="inline-block rounded-xl bg-white px-8 py-3 font-semibold text-teal transition-all duration-150 hover:bg-teal-light"
        >
          Create Your Account
        </Link>
      </div>
    </section>
  )
}
