"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { applySurplus, bankSurplus } from "@/lib/actions";
import type { Ship } from "@/lib/types";

const FormSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive.").min(0.01),
});

interface BankingFormProps {
  ship: Ship;
  actionType: 'bank' | 'apply';
  maxAmount: number;
  year: number;
}

export default function BankingForm({ ship, actionType, maxAmount, year }: BankingFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema.refine(data => data.amount <= maxAmount, {
      message: `Amount cannot exceed available ${actionType === 'bank' ? 'surplus' : 'banked amount'} of ${maxAmount.toFixed(2)}.`,
      path: ["amount"],
    })),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const action = actionType === 'bank'
      ? () => bankSurplus(ship.id, data.amount, year)
      : () => applySurplus(ship.id, data.amount, maxAmount, year);

    const result = await action();

    if (result.success) {
      toast({ title: "Success", description: result.message });
      form.reset();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const isDisabled = maxAmount <= 0 || form.formState.isSubmitting;
  const buttonText = actionType === 'bank' ? 'Bank Surplus' : 'Apply to Deficit';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} disabled={isDisabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isDisabled}>
          {form.formState.isSubmitting ? "Processing..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
