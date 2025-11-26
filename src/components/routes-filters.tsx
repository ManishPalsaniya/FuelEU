"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FuelType, VesselType } from '@/lib/types';

interface RoutesFiltersProps {
  vesselTypes: VesselType[];
  fuelTypes: FuelType[];
  years: string[];
}

export default function RoutesFilters({ vesselTypes, fuelTypes, years }: RoutesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string) => (value: string) => {
    router.push(pathname + '?' + createQueryString(name, value));
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Select onValueChange={handleFilterChange('vesselType')} defaultValue={searchParams.get('vesselType') || 'all'}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Vessel Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Vessel Types</SelectItem>
          {vesselTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select onValueChange={handleFilterChange('fuelType')} defaultValue={searchParams.get('fuelType') || 'all'}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Fuel Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Fuel Types</SelectItem>
          {fuelTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select onValueChange={handleFilterChange('year')} defaultValue={searchParams.get('year') || 'all'}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
