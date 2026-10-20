import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  Accessibility,
  Check,
  Download,
  ExternalLink,
  Files,
  FolderTree,
  Github,
  Hash,
  ShieldCheck,
  X,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/weftline/copy-button";
import { LegalFooterButtons } from "@/components/weftline/legal-dialog";

const PASSES = [
  {
    number: "01",
    name: "Unpick",
    accent: "teal",
    text: "Read the real requirements and the real codebase before writing anything. Ambiguities are written down, not guessed.",
  },
  {
    number: "02",
    name: "Warp",
    accent: "lime",
    text: "Plan hierarchy, breakpoints, interaction states, and motion before any interface code exists.",
  },
  {
    number: "03",
    name: "Weave",
    accent: "amber",
    text: "Semantic HTML first, the project's own design tokens first, responsive while building, not after.",
  },
  {
    number: "04",
    name: "Finish",
    accent: "orange",
    text: "Purposeful motion with a reduced-motion path, a complete state matrix, and copy that makes no unsupported claims.",
  },
  {
    number: "05",
    name: "Proof",
    accent: "emerald",
    text: "Run the checks, view the result at desktop and mobile widths, then report verified, unverified, and blocked items.",
  },
] as const;

// Per-pass accent tokens. Solid tints only, never gradients.
const PASS_ACCENTS: Record<string, { text: string; border: string; chip: string }> = {
  teal: { text: "text-teal-300", border: "border-teal-500/30", chip: "bg-teal-500/10" },
  lime: { text: "text-lime-300", border: "border-lime-500/30", chip: "bg-lime-500/10" },
  amber: { text: "text-amber-300", border: "border-amber-500/30", chip: "bg-amber-500/10" },
  orange: { text: "text-orange-300", border: "border-orange-500/30", chip: "bg-orange-500/10" },
  emerald: { text: "text-emerald-300", border: "border-emerald-500/30", chip: "bg-emerald-500/10" },
};

const TIERS = [
  { tier: "Patch", badge: "neutral", tasks: "Small fixes, copy edits, minor accessibility corrections", process: "Focused edit, then Pass 5 only. No plan document." },
  { tier: "Page", badge: "teal", tasks: "A new page, view, or section in an existing system", process: "All five passes with a lightweight plan." },
  { tier: "System", badge: "amber", tasks: "Multi-component work, feature areas, design-system additions", process: "All five passes plus boundaries, state, data flow, and a validation strategy." },
  { tier: "Motion", badge: "orange", tasks: "Animation-heavy work of any size", process: "All five passes with the motion ladder and a performance budget." },
] as const;

const TIER_BADGES: Record<string, string> = {
  neutral: "border-border bg-secondary text-secondary-foreground",
  teal: "border-teal-500/40 bg-teal-500/10 text-teal-300",
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  orange: "border-orange-500/40 bg-orange-500/10 text-orange-300",
};

const NEVER = [
  "Fake testimonials, reviews, client logos, or trust badges",
  "Invented metrics, usage counters, or unmeasured performance claims",
  "Vague hero text that fails to explain what the product does",
  "Emoji used as interface icons",
  "Purple gradients or gradient-heavy styling without a design reason",
  "Pill-shaped buttons as a default geometry",
  "Scroll hijacking, custom cursors, decorative motion",
  "Fake progress indicators or simulated functionality",
];

const ALWAYS = [
  "Deliberate typography, a coherent spacing scale, clear hierarchy",
  "Visible focus indicators and full keyboard operability",
  "Responsive layouts verified at narrow and wide widths",
  "Honest reporting: verified, unverified, or blocked, never invented",
];

const PROBLEMS = [
  {
    number: "01",
    accent: "teal",
    title: "No explicit craft bar",
    text: "Most briefs say make it look good. The model answers with the same interface every time: a centered card, a soft shadow, one safe gradient. The skill forces explicit decisions about hierarchy, spacing, and states before any code exists.",
  },
  {
    number: "02",
    accent: "amber",
    title: "Details get averaged away",
    text: "Interaction states, focus indicators, and motion intent are the first things generic output drops. Each pass writes them down as requirements, not leftovers.",
  },
  {
    number: "03",
    accent: "rose",
    title: "Claims go unverified",
    text: "Generated pages invent metrics, reviews, and counters that no backend supports. The hard rules forbid all three, and the final pass requires viewing the result at two widths before reporting done.",
  },
] as const;

const PROBLEM_ACCENTS: Record<string, string> = {
  teal: "text-teal-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
};

const FILE_MAP = [
  { path: "weftline/SKILL.md", text: "The method itself: five passes, depth tiers, hard rules, motion ladder. 204 lines." },
  { path: "weftline/references/design-principles.md", text: "Visual hierarchy, layout, color, typography, spacing, and the design decision checklist." },
  { path: "weftline/references/motion-engineering.md", text: "The motion ladder in depth: purpose test, technique comparison, performance and lifecycle rules." },
  { path: "weftline/references/accessibility-and-performance.md", text: "Accessibility requirements, responsive rules, and performance practices." },
  { path: "weftline/references/compatibility-and-installation.md", text: "Install paths per agent environment, with the verification status of every claim." },
  { path: "weftline/scripts/validate_skill.py", text: "49 structural and metadata checks. Python 3.7+ standard library only." },
  { path: "weftline/examples/good-workflow.md", text: "Worked examples across the depth tiers." },
  { path: "weftline/examples/anti-patterns.md", text: "Requests the skill must refuse or correct, and how to respond instead." },
  { path: "README.md", text: "Repository overview with the animated method map and install steps." },
  { path: "docs/pipeline.svg", text: "Animated diagram of the five passes, used by the README." },
  { path: ".github/workflows/validate.yml", text: "CI workflow: validates the skill on every push." },
  { path: "src/app/page.tsx", text: "This website: a Next.js 16 application presenting the method." },
];

const FAQ_ITEMS = [
  {
    q: "What exactly is an agent skill?",
    a: "A folder containing a SKILL.md file with YAML frontmatter and Markdown instructions, defined by the open Agent Skills specification at agentskills.io. An agent loads the description at startup and reads the full body whenever a task matches. Weftline's body is 204 lines and defers deeper detail to four reference files on demand, which is exactly the progressive-disclosure pattern the spec recommends.",
  },
  {
    q: "Which agents can install it?",
    a: "Any agent that reads repository files. The specification's client documentation records the cross-agent scan paths (.agents/skills/ at project or user scope) and the .claude/skills/ convention. Per-product activation has not been tested end to end, and the compatibility reference labels that status honestly for every environment.",
  },
  {
    q: "Does it need network access, API keys, or packages?",
    a: "No. The skill is plain Markdown. The bundled validation script needs Python 3.7 or newer and nothing else. There are zero runtime dependencies.",
  },
  {
    q: "Can I modify or rename it?",
    a: "Yes, it is MIT licensed. One rule to keep: the frontmatter name field must match the folder name. The validator checks this, so if you rename the skill, rename the folder to match and re-run the script.",
  },
  {
    q: "Why is it called Weftline?",
    a: "In a woven fabric, the weft is the thread carried back and forth through every pass of the loom; it is what holds the whole cloth together. The skill is that carried thread for interface work: one method that runs through every task, at every depth, without adding a framework or a runtime.",
  },
];

const INSTALL_ANY = `# 1. Download the archive and extract it
curl -fsSL -o weftline.zip https://YOUR-DOMAIN/api/download
unzip weftline.zip

# 2a. Copy the skill folder into the project (recommended, shared with your team)
cp -r weftline/weftline /path/to/your-project/.agents/skills/

# 2b. Or install for yourself across all projects
cp -r weftline/weftline ~/.agents/skills/

# 3. Verify the bundle
python3 weftline/weftline/scripts/validate_skill.py`;

const INSTALL_ANY_GITHUB = `# 1. Download the repository as a ZIP
curl -fsSL -o weftline.zip https://github.com/izynu/weftline/archive/refs/heads/main.zip
unzip weftline.zip

# 2a. Copy the skill folder into the project (recommended, shared with your team)
cp -r weftline-main/weftline /path/to/your-project/.agents/skills/

# 2b. Or install for yourself across all projects
cp -r weftline-main/weftline ~/.agents/skills/

# 3. Verify the bundle
python3 weftline-main/weftline/scripts/validate_skill.py`;

const INSTALL_GITHUB = `# 1. Clone the repository
git clone https://github.com/izynu/weftline.git
cd weftline

# 2. Copy the skill folder into your project
cp -r weftline /path/to/your-project/.agents/skills/

# 3. Verify the bundle
python3 weftline/scripts/validate_skill.py`;

const INSTALL_CLAUDE = `# User scope: available in every project
cp -r weftline/weftline ~/.claude/skills/

# Project scope: committed with the repository
cp -r weftline/weftline /path/to/your-project/.claude/skills/

# Verify
python3 ~/.claude/skills/weftline/scripts/validate_skill.py`;

const INSTALL_VERIFY = `python3 weftline/scripts/validate_skill.py
# Expected last line: Result: PASS  (49 of 49 checks)`;

const COUNT_FILES_CMD = `zipinfo -1 weftline.zip | grep -vc '/$'`;

const CHECKSUM_CMD = `sha256sum weftline.zip`;

// Folders and files that are workspace artifacts, never part of the package.
const TREE_SKIP = new Set([".git", ".next", "node_modules", "db", "export", "skills", "agent-ctx"]);

function walkTree(dir: string, prefix = "", lines: string[] = []): string[] {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !TREE_SKIP.has(entry.name) && !entry.name.endsWith(".log"))
    .sort((a, b) =>
      a.isDirectory() === b.isDirectory()
        ? a.name.localeCompare(b.name)
        : a.isDirectory()
          ? -1
          : 1
    );
  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    lines.push(
      `${prefix}${isLast ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 "}${entry.name}${entry.isDirectory() ? "/" : ""}`
    );
    if (entry.isDirectory()) {
      walkTree(path.join(dir, entry.name), prefix + (isLast ? "    " : "\u2502   "), lines);
    }
  });
  return lines;
}

function countFiles(dir: string): number {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (TREE_SKIP.has(entry.name) || entry.name.endsWith(".log")) continue;
    if (entry.isDirectory()) count += countFiles(path.join(dir, entry.name));
    else count += 1;
  }
  return count;
}

function countZipFileEntries(buffer: Buffer): number | null {
  // Count real file entries (directories excluded) from the zip central directory.
  const eocd = buffer.lastIndexOf("PK\u0005\u0006");
  if (eocd < 0) return null;
  const total = buffer.readUInt16LE(eocd + 10);
  const cdOffset = buffer.readUInt32LE(eocd + 16);
  let ptr = cdOffset;
  let files = 0;
  for (let i = 0; i < total; i++) {
    if (ptr + 46 > buffer.length || buffer.readUInt32LE(ptr) !== 0x02014b50) break;
    const nameLen = buffer.readUInt16LE(ptr + 28);
    const extraLen = buffer.readUInt16LE(ptr + 30);
    const commentLen = buffer.readUInt16LE(ptr + 32);
    const name = buffer.slice(ptr + 46, ptr + 46 + nameLen).toString("utf8");
    if (!name.endsWith("/")) files++;
    ptr += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

function getSiteData() {
  const cwd = process.cwd();
  const exportDir = path.join(cwd, "export");
  const zipPath = path.join(exportDir, "weftline.zip");

  // In this workspace the packaged repository copy lives under export/.
  // In a standalone checkout the repository root itself is the package.
  // On a hosted build (for example Vercel) neither is available, and the
  // site degrades honestly to GitHub links instead of guessing at data.
  const packagedRoot = path.join(exportDir, "complete", "weftline");
  const checkoutMarker = path.join(cwd, "weftline", "SKILL.md");
  const treeRoot = fs.existsSync(packagedRoot)
    ? packagedRoot
    : fs.existsSync(checkoutMarker)
      ? cwd
      : null;

  let zip: { size: number; hash: string; fileCount: number } | null = null;
  try {
    const zipStat = fs.statSync(zipPath);
    const zipBuffer = fs.readFileSync(zipPath);
    zip = {
      size: zipStat.size,
      hash: crypto.createHash("sha256").update(zipBuffer).digest("hex"),
      fileCount: countZipFileEntries(zipBuffer) ?? 0,
    };
  } catch {
    zip = null;
  }

  let checks: { total: number; passed: number } | null = null;
  try {
    const report = fs.readFileSync(path.join(exportDir, "validation-report.txt"), "utf8");
    const totals = report.match(/Total:\s*(\d+)\s+Passed:\s*(\d+)\s+Failed:\s*(\d+)/);
    if (totals) checks = { total: Number(totals[1]), passed: Number(totals[2]) };
  } catch {
    checks = null;
  }

  return {
    zip,
    checks,
    treeLines: treeRoot ? walkTree(treeRoot) : [],
    fileCount: zip ? zip.fileCount : treeRoot ? countFiles(treeRoot) : 0,
  };
}

function CodeBlock({ code, caption }: { code: string; caption?: string }) {
  return (
    <div className="space-y-2">
      <div className="relative rounded-md border border-border bg-[#141416]">
        <div className="absolute right-2 top-2">
          <CopyButton text={code} />
        </div>
        <pre
          aria-label="Terminal command"
          className="overflow-x-auto p-4 pr-24 font-mono text-[13px] leading-relaxed text-foreground/90 weftline-scroll"
        >
          {code}
        </pre>
      </div>
      {caption ? <p className="text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="#19191c" />
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="13.25" fill="none" stroke="#2a2a31" strokeWidth="1.5" />
      <g strokeLinecap="round" strokeWidth="4">
        <line x1="14" y1="27" x2="50" y2="27" stroke="#2dd4bf" />
        <line x1="14" y1="41" x2="50" y2="41" stroke="#fb7185" />
      </g>
      <path
        d="M17 20 L25 44 L32 25 L39 44 L47 20"
        fill="none"
        stroke="#eca43c"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const data = getSiteData();
  const zipSizeKb = data.zip ? Math.max(1, Math.round(data.zip.size / 1024)) : 0;
  const downloadHref = data.zip
    ? "/api/download"
    : "https://github.com/izynu/weftline/archive/refs/heads/main.zip";
  const downloadAttrs = data.zip ? { download: true } : {};
  const installAny = data.zip ? INSTALL_ANY : INSTALL_ANY_GITHUB;

  const stats = [
    { label: "workflow passes", value: "5", color: "text-teal-300" },
    { label: "depth tiers", value: "4", color: "text-lime-300" },
    {
      label: "validation checks",
      value: data.checks ? String(data.checks.total) : "49",
      color: "text-amber-300",
    },
    data.fileCount > 0
      ? { label: "files in the package", value: String(data.fileCount), color: "text-orange-300" }
      : { label: "license", value: "MIT", color: "text-orange-300" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-ring">
            <Wordmark className="size-7 shrink-0" />
            <span className="text-[15px] font-semibold tracking-tight">Weftline</span>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Frontend craft for AI coding agents
            </span>
          </a>
          <nav aria-label="Main" className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#method" className="transition-colors hover:text-foreground">Method</a>
            <a href="#install" className="transition-colors hover:text-foreground">Install</a>
            <a href="#verify" className="transition-colors hover:text-foreground">Verify</a>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          </nav>
          <Button asChild size="sm">
            <a href={downloadHref} {...downloadAttrs}>
              <Download className="size-4" aria-hidden="true" />
              {data.zip ? "Download" : "GitHub"}
            </a>
          </Button>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="scroll-mt-16">
          <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20">
            <p className="mb-6 inline-flex w-fit items-center rounded-md border border-amber-500/40 px-2 py-0.5 font-mono text-xs font-medium text-amber-300">
              Open source, MIT licensed, Agent Skills format, v0.1.0
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl">
              A frontend craft skill for AI coding agents.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Weftline is one folder with one SKILL.md. Your coding agent reads
              it before touching UI code and follows five passes: Unpick, Warp,
              Weave, Finish, Proof. Hard rules forbid fabricated metrics, fake
              social proof, and decorative motion. A motion ladder ranks
              techniques from plain CSS to the Web Animations API. Plain
              Markdown, no runtime, no dependencies.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6">
                <a href={downloadHref} {...downloadAttrs}>
                  <Download className="size-4" aria-hidden="true" />
                  {data.zip ? "Download the package (.zip)" : "Download ZIP from GitHub"}
                </a>
              </Button>
              <CopyButton
                text={installAny}
                label="Copy install command"
                className="h-12 px-6"
              />
              <Button asChild size="lg" variant="outline" className="h-12 px-6">
                <a
                  href="https://github.com/izynu/weftline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="size-4" aria-hidden="true" />
                  View source on GitHub
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </Button>
            </div>

            {/* Stat strip: counts read live from the shipped repository */}
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-card p-5 sm:p-6">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className={`font-mono text-3xl font-bold tracking-tight sm:text-4xl ${stat.color}`}>
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-sm text-muted-foreground">{stat.label}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              Counts are read from the repository at v0.1.0 when this page
              loads. The Verify section below shows the command that reproduces
              them.
            </p>
          </div>
        </section>

        {/* Problem */}
        <section className="scroll-mt-16 border-t border-border bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
              Why agent-built interfaces all feel the same
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              The problem is not model capability. It is that three inputs never
              make it into the prompt.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {PROBLEMS.map((problem) => (
                <div key={problem.number} className="min-w-0 rounded-lg border border-border bg-card p-6">
                  <p className={`font-mono text-sm font-semibold ${PROBLEM_ACCENTS[problem.accent]}`}>
                    {problem.number}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold">{problem.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{problem.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Method */}
        <section id="method" className="scroll-mt-16 border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Five passes, one thread</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              The weft is the thread carried through every pass of a weave. The
              same idea runs through every task the skill touches, from a
              one-line fix to a full design system.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {PASSES.map((pass) => {
                const accent = PASS_ACCENTS[pass.accent];
                return (
                  <div key={pass.number} className="min-w-0 rounded-lg border border-border bg-card">
                    <div className={`rounded-t-lg border-b px-4 py-3 ${accent.border} ${accent.chip}`}>
                      <p className={`font-mono text-sm font-semibold ${accent.text}`}>{pass.number}</p>
                      <h3 className="mt-0.5 font-semibold">{pass.name}</h3>
                    </div>
                    <p className="p-4 text-sm leading-relaxed text-muted-foreground">{pass.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {/* Depth tiers */}
              <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
                <div className="border-b border-border px-5 py-3.5">
                  <h3 className="font-semibold">Adaptive depth, four tiers</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The workflow scales down for one-line fixes instead of
                    imposing ceremony on every task.
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tier</TableHead>
                      <TableHead>Typical tasks</TableHead>
                      <TableHead className="hidden sm:table-cell">Process</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TIERS.map((t) => (
                      <TableRow key={t.tier}>
                        <TableCell>
                          <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${TIER_BADGES[t.badge]}`}>
                            {t.tier}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{t.tasks}</TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">{t.process}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Hard rules */}
              <div className="min-w-0 rounded-lg border border-border bg-card">
                <div className="border-b border-border px-5 py-3.5">
                  <h3 className="font-semibold">Hard rules the agent must obey</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The same standards this site holds itself to.
                  </p>
                </div>
                <div className="grid gap-0 sm:grid-cols-2">
                  <div className="border-border p-5 sm:border-r">
                    <p className="mb-3 flex items-center gap-2 text-sm font-medium text-rose-400">
                      <X className="size-4" aria-hidden="true" />
                      Never
                    </p>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      {NEVER.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-[7px] size-1 shrink-0 rounded-sm bg-rose-400/70" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-border p-5 sm:border-t-0">
                    <p className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-400">
                      <Check className="size-4" aria-hidden="true" />
                      Always
                    </p>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      {ALWAYS.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-[7px] size-1 shrink-0 rounded-sm bg-emerald-400/70" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Folder contents */}
        <section className="scroll-mt-16 border-t border-border bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight sm:text-3xl">
              <FolderTree className="size-6 text-teal-300" aria-hidden="true" />
              What ships in the folder
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {data.zip
                ? "The download contains exactly this tree, nothing generated and nothing left out."
                : data.treeLines.length > 0
                  ? "This repository contains exactly this tree, nothing generated and nothing left out."
                  : "This page is running from a hosted build. The exact folder contents are listed in the repository on GitHub."}
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-5">
              <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card lg:col-span-2">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <span className="font-mono text-xs text-foreground">weftline/</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {data.treeLines.length > 0 ? `${data.fileCount} files` : "see GitHub"}
                  </span>
                </div>
                <pre
                  aria-label="Repository file tree"
                  className="max-h-96 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-foreground/85 weftline-scroll"
                >
                  {data.treeLines.length > 0 ? data.treeLines.join("\n") : "Hosted build: open github.com/izynu/weftline for the full file tree."}
                </pre>
              </div>
              <ul className="min-w-0 divide-y divide-border rounded-lg border border-border bg-card lg:col-span-3">
                {FILE_MAP.map((file) => (
                  <li key={file.path} className="p-4">
                    <p className="break-all font-mono text-[13px] text-teal-300">{file.path}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{file.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Verify */}
        <section id="verify" className="scroll-mt-16 border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Check every claim yourself</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              No testimonials, no star ratings, no usage counters. The evidence
              is the folder itself, plus commands that verify it in seconds.
              Standard library only, no dependencies.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-300">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold">Skill validator</h3>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {data.checks
                    ? `${data.checks.total} structural checks over frontmatter, links, and content invariants.`
                    : "Structural checks over frontmatter, links, and content invariants."}{" "}
                  Python 3.7 or newer, nothing else.
                </p>
                <div className="mt-4">
                  <CodeBlock code={"python3 weftline/scripts/validate_skill.py"} />
                </div>
              </div>

              <div className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-md bg-orange-500/10 text-orange-300">
                    <Files className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold">File count</h3>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {data.zip
                    ? `${data.fileCount} files in the archive, counted from the ZIP central directory. The command prints the same number: it lists every entry and skips the folder rows. The download ships exactly these files and nothing else.`
                    : data.treeLines.length > 0
                      ? `${data.fileCount} files in this repository, counted by walking it. Clone it from GitHub to get exactly these files and nothing else.`
                      : "The exact file count is verified on every push by the repository CI. See the repository on GitHub."}
                </p>
                <div className="mt-4">
                  <CodeBlock code={data.zip ? COUNT_FILES_CMD : "git clone https://github.com/izynu/weftline.git"} />
                </div>
              </div>

              <div className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-md bg-teal-500/10 text-teal-300">
                    <Hash className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold">Checksum</h3>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {data.zip ? (
                    <>
                      SHA-256 of the archive this page serves right now. Compare it
                      against your download:
                      <span className="mt-1.5 block break-all font-mono text-xs text-foreground/80">
                        {data.zip.hash}
                      </span>
                    </>
                  ) : (
                    <>The site serves no archive of its own, so there is nothing to hash here. Verify the folder itself with the validator instead.</>
                  )}
                </p>
                <div className="mt-4">
                  <CodeBlock code={data.zip ? CHECKSUM_CMD : "python3 weftline/scripts/validate_skill.py"} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Install */}
        <section id="install" className="scroll-mt-16 border-t border-border bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Install on any agent</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Three steps, under a minute. Weftline is a folder, not a package:
              copy it into any location your agent scans, then reload the skill
              list. Project scope overrides user scope.
            </p>

            <ol className="mt-10 space-y-10">
              {/* Step 1 */}
              <li className="grid gap-4 md:grid-cols-[2.5rem_minmax(0,1fr)]">
                <span className="flex size-8 items-center justify-center rounded-md bg-amber-500/15 font-mono text-sm font-semibold text-amber-300">
                  1
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">Get the folder</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Download the archive and unzip it, or clone the repository:
                    either way you get the full package, the website and the
                    skill together. The skill is the weftline folder inside it.
                    That inner folder name must stay weftline: the frontmatter
                    name field must match the directory name.
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <a href={downloadHref} {...downloadAttrs}>
                      <Download className="size-4" aria-hidden="true" />
                      {data.zip ? `weftline.zip, ${data.fileCount} files, ${zipSizeKb} KB` : "Download ZIP from GitHub"}
                    </a>
                  </Button>
                </div>
              </li>

              {/* Step 2 */}
              <li className="grid gap-4 md:grid-cols-[2.5rem_minmax(0,1fr)]">
                <span className="flex size-8 items-center justify-center rounded-md bg-teal-500/15 font-mono text-sm font-semibold text-teal-300">
                  2
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">Copy it where your agent looks</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Pick the scope that matches how you work. The cross-agent
                    .agents paths come from the Agent Skills specification;
                    .claude/skills/ is the convention many implementations scan.
                  </p>
                  <div className="mt-4 rounded-lg border border-border bg-card p-5">
                    <Tabs defaultValue="any-agent">
                      <TabsList className="flex-wrap">
                        <TabsTrigger value="any-agent">Any agent (.agents)</TabsTrigger>
                        <TabsTrigger value="claude">Claude Code (.claude)</TabsTrigger>
                        <TabsTrigger value="github">From GitHub</TabsTrigger>
                      </TabsList>
                      <TabsContent value="any-agent" className="mt-5">
                        <CodeBlock code={installAny} />
                      </TabsContent>
                      <TabsContent value="claude" className="mt-5">
                        <CodeBlock code={INSTALL_CLAUDE} />
                      </TabsContent>
                      <TabsContent value="github" className="mt-5">
                        <CodeBlock code={INSTALL_GITHUB} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </li>

              {/* Step 3 */}
              <li className="grid gap-4 md:grid-cols-[2.5rem_minmax(0,1fr)]">
                <span className="flex size-8 items-center justify-center rounded-md bg-emerald-500/15 font-mono text-sm font-semibold text-emerald-300">
                  3
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">Validate before you rely on it</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Run the bundled validator after any install. It needs Python
                    3.7 or newer and no packages, and it exits nonzero on any
                    structural problem.
                  </p>
                  <div className="mt-4">
                    <CodeBlock code={INSTALL_VERIFY} />
                  </div>
                </div>
              </li>
            </ol>

            <div className="mt-10 flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-start">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-300">
                <Accessibility className="size-4" aria-hidden="true" />
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">After installing:</span>{" "}
                reload your agent&apos;s skill list, then test activation with a
                real prompt, for example: &quot;Build a pricing page for this
                project.&quot; Activation quality depends on the agent&apos;s
                own retrieval, so test it once before relying on it.
              </p>
            </div>
          </div>
        </section>

        {/* What it is not */}
        <section className="scroll-mt-16 border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What Weftline is not</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Weftline is not a framework, a plugin market, or a hosted
                service. There is no runtime and nothing to execute inside your
                app. Each skill is a folder of Markdown with frontmatter: copy
                it where your agent can read it, and the agent follows it. The
                Agent Skills format works with Claude Code natively, and with
                any other tool that can read project files.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-16 border-t border-border bg-card/40">
          <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Questions</h2>
            <Accordion type="single" collapsible className="mt-8">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={item.q} value={`item-${index}`}>
                  <AccordionTrigger className="text-[15px]">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2.5">
                <Wordmark className="size-7" />
                <span className="text-[15px] font-semibold tracking-tight">Weftline</span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                A cross-agent skill for disciplined frontend work. MIT
                licensed. Maintained by Zynu and Shraddha.
              </p>
            </div>
            <nav aria-label="Footer" className="text-sm">
              <p className="mb-3 font-medium">Site</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#method" className="transition-colors hover:text-foreground">Method</a></li>
                <li><a href="#install" className="transition-colors hover:text-foreground">Install</a></li>
                <li><a href="#verify" className="transition-colors hover:text-foreground">Verify</a></li>
                <li><a href="#faq" className="transition-colors hover:text-foreground">FAQ</a></li>
              </ul>
            </nav>
            <div className="text-sm">
              <p className="mb-3 font-medium">Legal and project</p>
              <div className="space-y-2 text-muted-foreground">
                <LegalFooterButtons />
                <p className="flex items-center gap-1.5">
                  <a
                    href="https://agentskills.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    Agent Skills specification
                    <ExternalLink className="ml-1 inline size-3.5" aria-hidden="true" />
                  </a>
                </p>
                <p className="flex items-center gap-1.5">
                  <a
                    href="https://github.com/izynu/weftline"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    <Github className="inline size-3.5" aria-hidden="true" />
                    github.com/izynu/weftline
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-9 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Zynu and Shraddha. Open source under the MIT license. v0.1.0.</p>
            <p>No cookies, no analytics, no tracking.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
