import { getShips, getBankingRecords } from "@/lib/data"
import BankingDashboard from "@/components/banking-dashboard"

export const dynamic = 'force-dynamic';

export default async function BankingPage() {
  const ships = await getShips();

  if (ships.length === 0) {
    return <div>No ships found.</div>
  }

  // Fetch banking records for all ships
  const bankingRecordsPromises = ships.map(ship => getBankingRecords(ship.id));
  const bankingRecordsResults = await Promise.all(bankingRecordsPromises);

  const initialBankingRecords: Record<string, any> = {};
  ships.forEach((ship, index) => {
    initialBankingRecords[ship.id] = bankingRecordsResults[index];
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Compliance Banking</h2>
        <p className="text-muted-foreground">Manage compliance balance surplus and deficits for your fleet.</p>
      </div>
      <BankingDashboard ships={ships} initialBankingRecords={initialBankingRecords} />
    </div>
  )
}
