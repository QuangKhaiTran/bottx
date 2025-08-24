'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const createRoomSchema = z.object({
  capital: z.coerce.number().min(10000, 'Minimum capital is $10,000'),
  minBet: z.coerce.number().min(10, 'Minimum bet is $10'),
  maxBet: z.coerce.number().min(100, 'Maximum bet must be at least $100'),
  maxPlayers: z.enum(['4', '6', '8']),
  betDuration: z.enum(['60', '90', '120']),
}).refine((data) => data.maxBet > data.minBet, {
    message: "Max bet must be greater than min bet.",
    path: ["maxBet"],
});

export type CreateRoomFormValues = z.infer<typeof createRoomSchema>;

interface CreateRoomFormProps {
    onSubmit: (values: CreateRoomFormValues) => void;
}

export function CreateRoomForm({ onSubmit }: CreateRoomFormProps) {
  const form = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      capital: 10000,
      minBet: 10,
      maxBet: 500,
      maxPlayers: "6",
      betDuration: "90",
    },
  });

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-6">
      <FormField
        control={form.control}
        name="capital"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Capital</FormLabel>
            <FormControl>
              <Input type="number" placeholder="e.g. 10000" {...field} />
            </FormControl>
            <FormDescription>
              The amount you are bringing as the house.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="minBet"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Min Bet</FormLabel>
                  <FormControl>
                      <Input type="number" placeholder="e.g. 10" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
          <FormField
              control={form.control}
              name="maxBet"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Max Bet</FormLabel>
                  <FormControl>
                      <Input type="number" placeholder="e.g. 500" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
          />
      </div>
      <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="maxPlayers"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Max Players</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                      <SelectTrigger>
                          <SelectValue placeholder="Select max players" />
                      </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          <SelectItem value="4">4 Players</SelectItem>
                          <SelectItem value="6">6 Players</SelectItem>
                          <SelectItem value="8">8 Players</SelectItem>
                      </SelectContent>
                  </Select>
                  <FormMessage />
                  </FormItem>
              )}
              />
          <FormField
              control={form.control}
              name="betDuration"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Round Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                      <SelectTrigger>
                          <SelectValue placeholder="Select round duration" />
                      </Trigger>
                      </FormControl>
                      <SelectContent>
                          <SelectItem value="60">60 seconds</SelectItem>
                          <SelectItem value="90">90 seconds</SelectItem>
                          <SelectItem value="120">120 seconds</SelectItem>
                      </SelectContent>
                  </Select>
                  <FormMessage />
                  </FormItem>
              )}
              />
      </div>
      <Button type="submit" className="w-full">Create PvP Room</Button>
    </Form>
  );
}
