'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, Users } from 'lucide-react';

export function PvPLobby() {
    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users />
                    PvP Game Lobby
                </CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <Construction className="w-16 h-16 text-muted-foreground mb-4"/>
                    <h2 className="text-2xl font-bold">PvP Mode Coming Soon!</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mt-2">
                        Get ready to challenge other players, become the house, and climb the leaderboards.
                        This feature is currently under construction.
                    </p>
                    <Button className="mt-6" disabled>Find a Room</Button>
                </div>
            </CardContent>
        </Card>
    );
}
