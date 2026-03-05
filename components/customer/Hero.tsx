import Link from 'next/link'

export default function Hero() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1120px] px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-text lg:text-5xl">
              Nourishing meals,
              <br />
              delivered to new moms.
            </h1>
            <p className="text-lg leading-relaxed text-neutral-muted">
              Fresh, postpartum-friendly food delivered on your schedule — so
              you can focus on what matters most.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="rounded-xl bg-teal px-6 py-3 font-semibold text-white transition-all duration-150 hover:bg-teal-dark"
              >
                See the Menu
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-teal bg-white px-6 py-3 font-semibold text-teal transition-all duration-150 hover:bg-teal-light"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Image placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div className="h-80 w-full max-w-md rounded-3xl bg-teal-light lg:h-[420px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
