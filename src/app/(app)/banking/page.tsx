import { getShip } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Banknote, TrendingDown, TrendingUp } from "lucide-react"
import BankingForm from "@/components/banking-form"

export default async function BankingPage() {
  // For simplicity, we'll manage the balance of a single ship
  const ship = await getShip("S001");

  if (!ship) {
    return <div>Ship not found.</div>
  }
  
  // This would typically be a more complex calculation or query
  const totalBankedSurplus = 50; 

  const kpis = [
    { title: "Current Compliance Balance", value: ship.complianceBalance.toFixed(2), icon: Banknote, delta: ship.complianceBalance > 0 ? "Surplus" : "Deficit", color: ship.complianceBalance > 0 ? 'text-green-400' : 'text-red-400' },
    { title: "Total Banked Surplus", value: totalBankedSurplus.toFixed(2), icon: TrendingUp, delta: "Available to apply", color: 'text-muted-foreground' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Compliance Banking</h2>
        <p className="text-muted-foreground">Manage your compliance balance surplus and deficits for {ship.name}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bank Surplus</CardTitle>
            <CardDescription>Move surplus from your compliance balance to your bank.</CardDescription>
          </CardHeader>
          <CardContent>
            <BankingForm
              ship={ship}
              actionType="bank"
              maxAmount={ship.complianceBalance > 0 ? ship.complianceBalance : 0}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Apply Surplus to Deficit</CardTitle>
            <CardDescription>Use your banked surplus to offset a compliance deficit.</CardDescription>
          </CardHeader>
          <CardContent>
            <BankingForm
              ship={ship}
              actionType="apply"
              maxAmount={totalBankedSurplus}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
