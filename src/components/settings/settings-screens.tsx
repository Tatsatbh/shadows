"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Activity,
  BadgeCheck,
  Bell,
  Check,
  Clock3,
  Coins,
  CreditCard,
  FileText,
  KeyRound,
  Lock,
  LucideIcon,
  Mail,
  Receipt,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserRound,
  WalletCards,
  Zap,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { fetchUserCredits } from "@/lib/queries"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store"

type Tone = "blue" | "emerald" | "amber" | "rose" | "zinc"

const toneClasses: Record<Tone, {
  border: string
  bg: string
  text: string
}> = {
  blue: {
    border: "border-blue-500/25",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
  },
  emerald: {
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
  },
  amber: {
    border: "border-amber-500/25",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
  },
  rose: {
    border: "border-rose-500/25",
    bg: "bg-rose-500/10",
    text: "text-rose-500",
  },
  zinc: {
    border: "border-border/50 dark:border-white/10",
    bg: "bg-muted/30 dark:bg-white/[0.035]",
    text: "text-muted-foreground dark:text-zinc-400",
  },
}

const settingsLinks = [
  { title: "Upgrade", href: "/upgrade", icon: Sparkles },
  { title: "Account", href: "/account", icon: BadgeCheck },
  { title: "Billing", href: "/billing", icon: CreditCard },
  { title: "Notifications", href: "/notifications", icon: Bell },
]

function userDisplayName() {
  const user = useAuthStore.getState().user
  return user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
}

function useCredits() {
  const user = useAuthStore((state) => state.user)

  return useQuery({
    queryKey: ["credits", user?.id],
    queryFn: () => fetchUserCredits(user!.id),
    enabled: !!user?.id,
  })
}

function SettingsPage({
  currentPage,
  eyebrow,
  title,
  description,
  icon: Icon,
  tone = "blue",
  metrics,
  children,
}: {
  currentPage: string
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  tone?: Tone
  metrics: Array<{
    label: string
    value: string
    icon: LucideIcon
    tone?: Tone
  }>
  children: ReactNode
}) {
  const pathname = usePathname()
  const activeTone = toneClasses[tone]

  return (
    <AppShell currentPage={currentPage}>
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5">
        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden rounded-[8px] border-border/70 bg-card/85 shadow-none backdrop-blur dark:border-white/10 dark:bg-[#05070a]/90 dark:shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl flex-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      "mb-4 rounded-[4px] px-2.5 py-1 text-[11px] uppercase tracking-normal",
                      activeTone.border,
                      activeTone.bg,
                      activeTone.text
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {eyebrow}
                  </Badge>
                  <h1 className="font-opencode text-2xl font-semibold leading-tight tracking-normal text-foreground md:text-3xl">
                    {title}
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
                <div className="grid min-w-0 shrink-0 gap-3 sm:grid-cols-3 lg:min-w-[430px]">
                  {metrics.map((metric) => (
                    <MetricCard key={metric.label} {...metric} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[8px] border-border/70 bg-card/85 shadow-none backdrop-blur dark:border-white/10 dark:bg-[#05070a]/90">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="flex items-center gap-2 font-opencode text-sm font-medium">
                <Terminal className="h-4 w-4 text-blue-500" />
                Account menu
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 px-5 pb-5 sm:grid-cols-2">
              {settingsLinks.map((item) => {
                const ItemIcon = item.icon
                const active = pathname === item.href

                return (
                  <Button
                    key={item.href}
                    asChild
                    variant="outline"
                    className={cn(
                      "h-12 justify-start rounded-[6px] border-border/50 bg-muted/30 px-3 text-muted-foreground shadow-none hover:border-blue-500/35 hover:bg-blue-500/10 hover:text-blue-600 dark:border-white/10 dark:bg-white/[0.025] dark:text-zinc-300 dark:hover:text-blue-400",
                      active && "border-blue-500/35 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    )}
                  >
                    <Link href={item.href}>
                      <ItemIcon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </section>

        {children}
      </div>
    </AppShell>
  )
}

function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
}: {
  label: string
  value: string
  icon: LucideIcon
  tone?: Tone
}) {
  const activeTone = toneClasses[tone]

  return (
    <div className="rounded-[6px] border border-border/70 bg-muted/35 p-3 dark:border-white/10 dark:bg-white/[0.035]">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[11px] uppercase">{label}</span>
        <Icon className={cn("h-4 w-4", activeTone.text)} />
      </div>
      <p className="mt-3 truncate text-xl font-semibold xl:text-2xl">{value}</p>
    </div>
  )
}

function FieldGroup({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-blue-500" />
        {label}
      </Label>
      <Input
        readOnly
        value={value}
        className="h-11 rounded-[6px] border-border/50 bg-muted/30 text-foreground shadow-none dark:border-white/10 dark:bg-white/[0.035] dark:text-zinc-100"
      />
    </div>
  )
}

function StatusRow({
  icon: Icon,
  title,
  detail,
  badge,
  tone = "blue",
}: {
  icon: LucideIcon
  title: string
  detail: string
  badge?: string
  tone?: Tone
}) {
  const activeTone = toneClasses[tone]

  return (
    <div className="flex items-center justify-between gap-4 rounded-[6px] border border-border/50 bg-muted/30 p-3 dark:border-white/10 dark:bg-white/[0.025]">
      <div className="flex min-w-0 items-center gap-3">
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-[6px] border", activeTone.border, activeTone.bg)}>
          <Icon className={cn("h-4 w-4", activeTone.text)} />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground dark:text-zinc-100">{title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground dark:text-zinc-500">{detail}</p>
        </div>
      </div>
      {badge && (
        <Badge variant="outline" className={cn("shrink-0 rounded-[4px]", activeTone.border, activeTone.bg, activeTone.text)}>
          {badge}
        </Badge>
      )}
    </div>
  )
}

function SettingSwitch({
  title,
  detail,
  defaultChecked = true,
}: {
  title: string
  detail: string
  defaultChecked?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[6px] border border-border/50 bg-muted/30 p-4 dark:border-white/10 dark:bg-white/[0.025]">
      <div>
        <p className="font-medium text-foreground dark:text-zinc-100">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground dark:text-zinc-500">{detail}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}

export function UpgradeScreen() {
  const { data: credits } = useCredits()

  return (
    <SettingsPage
      currentPage="Upgrade"
      eyebrow="Plan control"
      title="Upgrade to Pro."
      description="More interview rooms, deeper report history, and higher credit ceilings for regular practice."
      icon={Sparkles}
      tone="amber"
      metrics={[
        { label: "Current", value: "Beta", icon: ShieldCheck, tone: "blue" },
        { label: "Credits", value: String(credits ?? "--"), icon: Coins, tone: "amber" },
        { label: "Mode", value: "Ready", icon: Activity, tone: "emerald" },
      ]}
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            name: "Beta",
            price: "$0",
            badge: "Current",
            tone: "blue" as Tone,
            features: ["100 included credits", "Core interview rooms", "Report archive"],
          },
          {
            name: "Pro",
            price: "$19",
            badge: "Recommended",
            tone: "amber" as Tone,
            features: ["Higher monthly credits", "Priority report generation", "Advanced session history"],
          },
          {
            name: "Team",
            price: "Custom",
            badge: "Soon",
            tone: "zinc" as Tone,
            features: ["Shared candidate reviews", "Team billing", "Centralized reporting"],
          },
        ].map((plan) => {
          const activeTone = toneClasses[plan.tone]

          return (
            <Card key={plan.name} className={cn("rounded-[8px] border-border/70 bg-card/85 shadow-none dark:border-white/10 dark:bg-[#05070a]/90", plan.name === "Pro" && "dark:border-amber-500/35")}>
              <CardHeader className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <Badge variant="outline" className={cn("rounded-[4px]", activeTone.border, activeTone.bg, activeTone.text)}>
                    {plan.badge}
                  </Badge>
                </div>
                <div>
                  <span className="font-opencode text-3xl font-semibold">{plan.price}</span>
                  {plan.price.startsWith("$") && <span className="text-sm text-muted-foreground"> / month</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-5 pb-5">
                <Separator className="bg-border/50 dark:bg-white/10" />
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground dark:text-zinc-300">
                      <Check className={cn("h-4 w-4", activeTone.text)} />
                      {feature}
                    </div>
                  ))}
                </div>
                <Button
                  variant={plan.name === "Pro" ? "default" : "outline"}
                  className={cn(
                    "mt-2 w-full rounded-[6px]",
                    plan.name === "Pro"
                      ? "bg-blue-500 text-white hover:bg-blue-500/90"
                      : "border-border/50 bg-muted/30 text-foreground hover:border-blue-500/35 hover:bg-blue-500/10 hover:text-blue-600 dark:border-white/10 dark:bg-white/[0.025] dark:text-zinc-200 dark:hover:text-blue-400"
                  )}
                >
                  {plan.name === "Beta" ? "Current plan" : plan.name === "Team" ? "Contact sales" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </SettingsPage>
  )
}

export function AccountScreen() {
  const user = useAuthStore((state) => state.user)
  const name = user?.user_metadata?.full_name || userDisplayName()
  const email = user?.email || "No email"
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"
  const lastSignIn = user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Unknown"

  return (
    <SettingsPage
      currentPage="Account"
      eyebrow="Identity"
      title="Account settings."
      description="Profile, security, and login details for your Shadows workspace."
      icon={BadgeCheck}
      metrics={[
        { label: "Profile", value: "Active", icon: UserRound, tone: "emerald" },
        { label: "Created", value: createdAt, icon: Clock3, tone: "blue" },
        { label: "Security", value: "On", icon: Lock, tone: "emerald" },
      ]}
    >
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="rounded-[6px] border border-border/50 bg-muted/30 dark:border-white/10 dark:bg-[#05070a]/90">
          <TabsTrigger value="profile" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400">Profile</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-0">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <Card className="rounded-[8px] border-border/70 bg-card/85 shadow-none dark:border-white/10 dark:bg-[#05070a]/90">
              <CardHeader className="border-b border-border/50 dark:border-white/10 p-5">
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-5 md:grid-cols-2">
                <FieldGroup label="Display name" value={name} icon={UserRound} />
                <FieldGroup label="Email" value={email} icon={Mail} />
                <FieldGroup label="Workspace" value="Shadows Beta" icon={Terminal} />
                <FieldGroup label="Member since" value={createdAt} icon={Clock3} />
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border-border/70 bg-card/85 shadow-none dark:border-white/10 dark:bg-[#05070a]/90">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-lg">Account state</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-5 pb-5">
                <StatusRow icon={ShieldCheck} title="Verified profile" detail="Session access is tied to this login." badge="Active" tone="emerald" />
                <StatusRow icon={FileText} title="Report access" detail="Private reports stay owner-only." badge="Private" tone="blue" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="security" className="mt-0">
          <Card className="rounded-[8px] border-border/70 bg-card/85 shadow-none dark:border-white/10 dark:bg-[#05070a]/90">
            <CardHeader className="border-b border-border/50 dark:border-white/10 p-5">
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 p-5">
              <StatusRow icon={Mail} title="Primary email" detail={email} badge="Confirmed" tone="emerald" />
              <StatusRow icon={KeyRound} title="Authentication" detail="Managed through Supabase Auth." badge="Enabled" tone="blue" />
              <StatusRow icon={Clock3} title="Last sign in" detail={lastSignIn} badge="Recent" tone="zinc" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SettingsPage>
  )
}

export function BillingScreen() {
  const { data: credits } = useCredits()

  return (
    <SettingsPage
      currentPage="Billing"
      eyebrow="Credits"
      title="Billing and credits."
      description="Track credit balance, billing readiness, and invoice history."
      icon={CreditCard}
      metrics={[
        { label: "Credits", value: String(credits ?? "--"), icon: Coins, tone: "amber" },
        { label: "Plan", value: "Beta", icon: WalletCards, tone: "blue" },
        { label: "Invoices", value: "0", icon: Receipt, tone: "zinc" },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Card className="rounded-[8px] border-border/70 bg-card/85 shadow-none dark:border-white/10 dark:bg-[#05070a]/90">
          <CardHeader className="border-b border-border/50 dark:border-white/10 p-5">
            <CardTitle>Credit balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="rounded-[6px] border border-amber-500/25 bg-amber-500/10 p-4">
              <p className="text-[11px] uppercase text-amber-500">Available credits</p>
              <p className="mt-2 font-opencode text-4xl font-semibold text-foreground dark:text-zinc-100">{credits ?? "--"}</p>
            </div>
            <StatusRow icon={Zap} title="Interview room cost" detail="One room consumes credits when the session starts." badge="Metered" tone="blue" />
            <StatusRow icon={CreditCard} title="Payment method" detail="No card is attached to this beta workspace." badge="Beta" tone="zinc" />
          </CardContent>
        </Card>

        <Card className="rounded-[8px] border-border/70 bg-card/85 shadow-none dark:border-white/10 dark:bg-[#05070a]/90">
          <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border/50 dark:border-white/10 p-5">
            <CardTitle>Invoices</CardTitle>
            <Badge variant="outline" className="rounded-[4px] border-border/50 bg-muted/30 text-muted-foreground dark:border-white/10 dark:bg-white/[0.035] dark:text-zinc-400">
              Beta workspace
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent dark:border-white/10">
                  <TableHead className="px-5">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right pr-5">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border/50 hover:bg-muted/50 dark:border-white/10 dark:hover:bg-white/[0.025]">
                  <TableCell className="px-5 text-muted-foreground dark:text-zinc-400">No invoices yet</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-[4px] border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400">Beta</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground dark:text-zinc-400">$0.00</TableCell>
                  <TableCell className="pr-5 text-right text-muted-foreground dark:text-zinc-500">--</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SettingsPage>
  )
}

export function NotificationsScreen() {
  return (
    <SettingsPage
      currentPage="Notifications"
      eyebrow="Alerts"
      title="Notification preferences."
      description="Control the account, report, and credit alerts that should interrupt you."
      icon={Bell}
      metrics={[
        { label: "Reports", value: "On", icon: FileText, tone: "emerald" },
        { label: "Credits", value: "On", icon: Coins, tone: "amber" },
        { label: "Security", value: "On", icon: ShieldCheck, tone: "blue" },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="rounded-[8px] border-border/70 bg-card/85 shadow-none dark:border-white/10 dark:bg-[#05070a]/90">
          <CardHeader className="border-b border-border/50 dark:border-white/10 p-5">
            <CardTitle>Delivery rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            <SettingSwitch title="Report ready" detail="Send an alert when an interview report finishes processing." />
            <SettingSwitch title="Low credit balance" detail="Send an alert before credits are too low to start another room." />
            <SettingSwitch title="Product updates" detail="Occasional beta release notes and workflow improvements." defaultChecked={false} />
            <SettingSwitch title="Security activity" detail="Authentication and account access notices." />
          </CardContent>
        </Card>

        <Card className="rounded-[8px] border-border/70 bg-card/85 shadow-none dark:border-white/10 dark:bg-[#05070a]/90">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-lg">Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5">
            <StatusRow icon={Mail} title="Email" detail="Primary delivery channel." badge="Enabled" tone="emerald" />
            <StatusRow icon={Bell} title="In-app" detail="Shown while you are using Shadows." badge="On" tone="blue" />
            <StatusRow icon={Clock3} title="Digest" detail="Weekly summary is currently paused." badge="Paused" tone="zinc" />
          </CardContent>
        </Card>
      </div>
    </SettingsPage>
  )
}
