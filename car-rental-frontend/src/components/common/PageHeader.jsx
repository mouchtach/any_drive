import Badge from '@/components/ui/Badge'

/**
 * Title block shown at the top of every (placeholder) page.
 * `access` tells who is allowed to see the page - handy to demo authorization.
 */
export default function PageHeader({ title, subtitle, access }) {
  return (
    <section className="container-page py-12 md:py-16">
      {access && <Badge tone="accent" className="mb-4">Access: {access}</Badge>}
      <h1 className="text-3xl md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-muted">{subtitle}</p>}
    </section>
  )
}
