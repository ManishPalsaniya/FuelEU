import PoolingConfiguration from "@/components/pooling-configuration";
import { getShips } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function PoolingPage() {
  const ships = await getShips();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pooling Simulator</h2>
      </div>
      <PoolingConfiguration initialShips={ships} />
    </div>
  );
}
