import PoolingConfiguration from "@/components/pooling-configuration";
import { getShips } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function PoolingPage() {
  const ships = await getShips();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pooling Simulator</h2>
        <p className="text-muted-foreground">Simulate fuel pooling based on FuelEU Maritime Regulation Article 21.</p>
      </div>
      <PoolingConfiguration initialShips={ships} />
    </div>
  );
}
