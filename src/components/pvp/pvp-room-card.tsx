'use client';

import type { PvPGameSession } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Crown, DollarSign, LogIn, Scaling, Clock } from 'lucide-react';
import { Badge } from "../ui/badge";

interface PvPRoomCardProps {
    room: PvPGameSession;
}

export function PvPRoomCard({ room }: PvPRoomCardProps) {

    const playersRatio = `${room.currentPlayers.length} / ${room.maxPlayers}`;

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Crown className="text-yellow-400" />
                    {room.houseUsername}
                </CardTitle>
                <CardDescription>
                    House Capital: ${room.houseBalance.toLocaleString()}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users /> Player Count
                    </div>
                    <Badge variant="secondary">{playersRatio}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Scaling /> Bet Limits
                    </div>
                    <Badge variant="outline">${room.minBet} / ${room.maxBet}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock /> Round Time
                    </div>
                     <Badge variant="outline">{room.betDuration}s</Badge>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    <LogIn />
                    Join Room
                </Button>
            </CardFooter>
        </Card>
    )
}
