import Link from 'next/link'

interface FooterProps {
  showNav?: boolean
}

export default function Footer({ showNav = false }: FooterProps) {
  return (
    <footer className="border-t border-neutral-border py-8">
      <div className="mx-auto max-w-[1120px] px-6 lg:px-10">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-neutral-muted">
            &copy; {new Date().getFullYear()} Nourish Mom
          </p>
          {showNav && (
            <nav className="flex gap-6">
              <Link
                href="/menu"
                className="text-sm text-neutral-muted transition-colors hover:text-teal"
              >
                Menu
              </Link>
              <Link
                href="/login"
                className="text-sm text-neutral-muted transition-colors hover:text-teal"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="text-sm text-neutral-muted transition-colors hover:text-teal"
              >
                Register
              </Link>
            </nav>
          )}
        </div>
      </div>
    </footer>
  )
}
