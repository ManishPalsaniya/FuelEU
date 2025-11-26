"use server";

import { revalidatePath } from 'next/cache';
import { apiClient } from '@/lib/api-client';
import type { PoolCreationResult } from './types';

export async function setBaseline(routeId: string) {
  try {
    await apiClient.post(`/routes/${routeId}/baseline`);
    revalidatePath('/routes');
    revalidatePath('/compare');
    return { success: true, message: 'Baseline set successfully.' };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || 'Failed to set baseline.' };
  }
}

export async function bankSurplus(shipId: string, amount: number) {
  try {
    const year = 2025;
    await apiClient.post('/banking/bank', { shipId, year, amount });
    revalidatePath('/banking');
    return { success: true, message: `Successfully banked ${amount.toFixed(2)} units.` };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || 'Failed to bank surplus.' };
  }
}

export async function applySurplus(shipId: string, amount: number, bankedAmount: number) {
  try {
    const year = 2025;
    await apiClient.post('/banking/apply', { shipId, year, amount });
    revalidatePath('/banking');
    return { success: true, message: `Successfully applied surplus.` };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || 'Failed to apply surplus.' };
  }
}

export async function createPool(shipIds?: string[]): Promise<PoolCreationResult> {
  console.log('createPool action started', { shipIds });
  try {
    const { getShips } = await import('./data');
    const allShips = await getShips();
    console.log('Fetched all ships', allShips.length);

    // If no IDs provided, use all ships (fallback behavior)
    const memberIds = shipIds && shipIds.length > 0 ? shipIds : allShips.map(s => s.id);

    // Determine year from the first selected ship
    const selectedShips = allShips.filter(s => memberIds.includes(s.id));
    if (selectedShips.length === 0) {
      throw new Error("No ships selected for pooling.");
    }

    const year = selectedShips[0].year;

    // Validate all ships are from the same year
    const differentYearShip = selectedShips.find(s => s.year !== year);
    if (differentYearShip) {
      throw new Error(`All ships in a pool must be from the same reporting year. Found ${year} and ${differentYearShip.year}.`);
    }

    console.log(`Creating pool for year ${year} with members:`, memberIds);

    const response = await apiClient.post('/pools', { members: memberIds, year });
    console.log('Backend response received', response.status);
    const pool = response.data;
    console.log('Pool data:', pool);

    // Map backend pool to PoolCreationResult
    const poolMembers = pool.members || [];
    const afterShips = allShips.map(ship => {
      const member = poolMembers.find((m: any) => m.shipId === ship.id);
      if (member) {
        return { ...ship, complianceBalance: member.cbAfter, adjustedComplianceBalance: member.cbAfter };
      }
      return ship;
    });

    const result = {
      isCompliant: pool.isValid,
      before: allShips.filter(s => memberIds.includes(s.id)),
      after: afterShips.filter(s => memberIds.includes(s.id)),
      totalBefore: 0,
      totalAfter: pool.sumCb,
    };
    console.log('Returning result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error: any) {
    console.error('Pool creation failed:', error);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    return {
      isCompliant: false,
      before: [],
      after: [],
      totalBefore: 0,
      totalAfter: 0,
    };
  }
}
