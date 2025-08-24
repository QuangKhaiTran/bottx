'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Crown, Home, PlusCircle, Users } from 'lucide-react';
import type { PvPGameSession } from '@/types';
import { CreateRoomForm, type CreateRoomFormValues } from './create-room-form';
import { PvPRoomCard } from './pvp-room-card';

const initialRooms: PvPGameSession[] = [
  {
    id: 'room-1',
    houseId: 'house-player-1',
    houseUsername: 'CryptoKing',
    houseBalance: 150000,
    maxPlayers: 8,
    currentPlayers: [ { id: 'p1', username: 'Player1', balance: 1000, currentBet: null, playerStats: { totalGamesPlayed: 0, totalWinnings: 0, winRate: 0}}, { id: 'p2', username: 'Player2', balance: 1000, currentBet: null, playerStats: { totalGamesPlayed: 0, totalWinnings: 0, winRate: 0}}],
    gameState: 'waiting',
    countdown: 60,
    betDuration: 60,
    minBet: 10,
    maxBet: 500,
    result: null,
    createdAt: 1700000000000 - 120000,
  },
  {
    id: 'room-2',
    houseId: 'house-player-2',
    houseUsername: 'DiceDuchess',
    houseBalance: 500000,
    maxPlayers: 6,
    currentPlayers: [ { id: 'p1', username: 'Player1', balance: 1000, currentBet: null, playerStats: { totalGamesPlayed: 0, totalWinnings: 0, winRate: 0}}, { id: 'p2', username: 'Player2', balance: 1000, currentBet: null, playerStats: { totalGamesPlayed: 0, totalWinnings: 0, winRate: 0}}, { id: 'p3', username: 'Player3', balance: 1000, currentBet: null, playerStats: { totalGamesPlayed: 0, totalWinnings: 0, winRate: 0}} ],
    gameState: 'waiting',
    countdown: 90,
    betDuration: 90,
    minBet: 50,
    maxBet: 2000,
    result: null,
    createdAt: 1700000000000 - 300000,
  },
  {
    id: 'room-3',
    houseId: 'house-player-3',
    houseUsername: 'HighRoller',
    houseBalance: 1000000,
    maxPlayers: 8,
    currentPlayers: [],
    gameState: 'waiting',
    countdown: 120,
    betDuration: 120,
    minBet: 100,
    maxBet: 10000,
    result: null,
    createdAt: 1700000000000,
  }
];


export function PvPLobby() {
  const [rooms, setRooms] = useState<PvPGameSession[]>(initialRooms);
  const [isCreateRoomOpen, setCreateRoomOpen] = useState(false);

  const handleCreateRoom = (values: CreateRoomFormValues) => {
    console.log("Creating room with values:", values);
    const newRoom: PvPGameSession = {
      id: `room-${Date.now()}`,
      houseId: 'current-user', // Placeholder
      houseUsername: 'New House', // Placeholder
      houseBalance: values.capital,
      maxPlayers: parseInt(values.maxPlayers, 10),
      currentPlayers: [],
      gameState: 'waiting',
      countdown: parseInt(values.betDuration, 10),
      betDuration: parseInt(values.betDuration, 10),
      minBet: values.minBet,
      maxBet: values.maxBet,
      result: null,
      createdAt: Date.now(),
    };
    
    setRooms(prevRooms => [newRoom, ...prevRooms]);
    setCreateRoomOpen(false);
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
                <Users />
                PvP Game Lobby
            </CardTitle>
             <Dialog open={isCreateRoomOpen} onOpenChange={setCreateRoomOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle />
                        Create Room
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'><Crown /> Become the House</DialogTitle>
                    </DialogHeader>
                    <CreateRoomForm onSubmit={handleCreateRoom} />
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-primary">Available Rooms</h2>
            {rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map(room => (
                       <PvPRoomCard key={room.id} room={room} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-4 border-dashed border-2 rounded-lg">
                    <Home className="w-12 h-12 text-muted-foreground mb-4"/>
                    <h3 className="text-lg font-semibold">No Rooms Available</h3>
                    <p className="text-muted-foreground text-sm">
                        Why not be the first to create one?
                    </p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
