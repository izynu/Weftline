"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type LegalKind = "privacy" | "terms"

const LAST_UPDATED = "2026-10-19"

function PrivacyContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">1. What this site is</h3>
        <p>
          This website documents Weftline, an open-source skill for coding
          agents, and serves its downloadable archive. It is operated as a
          project site for the Weftline repository (MIT license).
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">2. Data we collect</h3>
        <p>
          Weftline does not collect, store, or share personal data. The site
          has no accounts, no forms that submit personal information, no
          newsletters, and no comment systems. Nothing you do here creates a
          record in a Weftline database, because the site runs without one.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">3. Cookies and tracking</h3>
        <p>
          The site sets no cookies, uses no analytics services, embeds no
          advertising, and loads no third-party tracking scripts. Your visits
          are not profiled by this project.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">4. Server logs</h3>
        <p>
          Like nearly every website, the hosting provider may process standard
          request logs (IP address, user agent, requested URL, timestamp) for
          security and abuse prevention. Weftline does not read, enrich, or
          retain these logs for any other purpose, and retention is governed
          by the hosting provider.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">5. Downloads</h3>
        <p>
          The Download button serves a static ZIP archive from the project
          server. The download itself does not register your identity, and we
          do not count or correlate downloads with visitors.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">6. Third parties</h3>
        <p>
          The site links to external services (for example GitHub and
          agentskills.io). Once you follow a link, that service&apos;s own
          privacy policy applies. Weftline transmits nothing to them on your
          behalf.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">7. Children</h3>
        <p>
          The site is a developer document. It does not knowingly target
          children, and it collects no data from anyone, of any age.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">8. Changes</h3>
        <p>
          If this policy changes, the updated text will be published on this
          page with a new date. Material changes will be noted in the
          repository&apos;s changelog.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">9. Contact</h3>
        <p>
          Questions about this policy can be opened as an issue on the
          Weftline GitHub repository, where the maintainers (Zynu and
          Shraddha) respond publicly.
        </p>
      </section>
    </div>
  )
}

function TermsContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">1. Acceptance</h3>
        <p>
          By using this website you agree to these terms. If you do not agree,
          do not use the site. These terms apply to the website only; use of
          the Weftline software itself is governed by its MIT license.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">2. The service</h3>
        <p>
          This site provides documentation for the Weftline skill and serves
          its archive. It is provided as-is, with no commitment to
          availability, uptime, or continued development.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">3. Acceptable use</h3>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Do not attack, overload, or automate abusive request volumes against the site.</li>
          <li>Do not misrepresent the origin of the software or remove its license and attribution.</li>
          <li>Do not use the site to publish or distribute content that is unlawful where you live.</li>
        </ul>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">4. Intellectual property</h3>
        <p>
          The Weftline repository, including the skill, its research files,
          this site&apos;s source, and its written content, is released under
          the MIT license. You may use, copy, modify, and distribute it under
          that license&apos;s terms, which require keeping the copyright and
          permission notice.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">5. No warranty</h3>
        <p>
          The site and the software are provided &quot;as is&quot;, without
          warranty of any kind, express or implied, including but not limited
          to the warranties of merchantability, fitness for a particular
          purpose, and non-infringement. Weftline guides agent behavior; it
          does not guarantee any specific output quality from any specific
          agent product.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">6. Limitation of liability</h3>
        <p>
          To the maximum extent permitted by law, the maintainers are not
          liable for any damages arising from use of, or inability to use,
          this site or the Weftline software, even if advised of the
          possibility of such damages.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">7. External links</h3>
        <p>
          Linked external sites are governed by their own terms. The
          maintainers are not responsible for third-party content.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">8. Changes to these terms</h3>
        <p>
          The maintainers may update these terms as the project evolves. The
          current text is always the version published on this page with its
          date of last update.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">9. Governing law</h3>
        <p>
          These terms are governed by the laws applicable to the repository
          maintainer&apos;s place of residence, without regard to conflict of
          law rules. Disputes will be handled in the courts of that
          jurisdiction.
        </p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">10. Contact</h3>
        <p>
          Questions about these terms can be raised as an issue on the
          Weftline GitHub repository.
        </p>
      </section>
    </div>
  )
}

export function LegalDialog({
  kind,
  children,
}: {
  kind: LegalKind
  children: React.ReactNode
}) {
  const isOpenPrivacy = kind === "privacy"
  const title = isOpenPrivacy ? "Privacy Policy" : "Terms of Service"
  const description = isOpenPrivacy
    ? `How this site handles data. Last updated ${LAST_UPDATED}. Short version: it does not collect any.`
    : `The rules for using this site. Last updated ${LAST_UPDATED}.`

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-h-[85vh] max-w-2xl overflow-y-auto weftline-scroll sm:rounded-lg"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
        {isOpenPrivacy ? <PrivacyContent /> : <TermsContent />}
        <p className="border-t border-border pt-4 text-xs text-muted-foreground">
          {title}. Weftline project. Last updated {LAST_UPDATED}.
        </p>
      </DialogContent>
    </Dialog>
  )
}

export function LegalFooterButtons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <LegalDialog kind="privacy">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-0 py-1 text-muted-foreground hover:text-foreground hover:no-underline"
        >
          Privacy Policy
        </Button>
      </LegalDialog>
      <span className="text-border" aria-hidden="true">
        /
      </span>
      <LegalDialog kind="terms">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-0 py-1 text-muted-foreground hover:text-foreground hover:no-underline"
        >
          Terms of Service
        </Button>
      </LegalDialog>
    </div>
  )
}
