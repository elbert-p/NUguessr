"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Search } from "lucide-react"

// Mock data - replace with actual data from your database
const leaderboardData = [
  { rank: 1, username: "Kanghosaeyo", totalScore: 999999, gamesPlayed: 50, avgScore: 500, accuracy: "95%" }, // 'accuracy' field represents % explored
  { rank: 2, username: "Philyshark7", totalScore: 22000, gamesPlayed: 45, avgScore: 489, accuracy: "92%" },
  { rank: 3, username: "Joshuaa_chann", totalScore: 20000, gamesPlayed: 42, avgScore: 476, accuracy: "90%" },
  { rank: 4, username: "Alantai26", totalScore: 18500, gamesPlayed: 40, avgScore: 463, accuracy: "88%" },
  { rank: 5, username: "MapMaster", totalScore: 17000, gamesPlayed: 38, avgScore: 447, accuracy: "85%" },
  { rank: 6, username: "CampusKing", totalScore: 16000, gamesPlayed: 35, avgScore: 457, accuracy: "86%" },
  { rank: 7, username: "HuskieNav", totalScore: 15000, gamesPlayed: 33, avgScore: 455, accuracy: "84%" },
  { rank: 8, username: "PathPro", totalScore: 14000, gamesPlayed: 30, avgScore: 467, accuracy: "87%" },
  { rank: 9, username: "NEUExplorer", totalScore: 13000, gamesPlayed: 28, avgScore: 464, accuracy: "85%" },
  { rank: 10, username: "Landmarker", totalScore: 12000, gamesPlayed: 25, avgScore: 480, accuracy: "89%" },
]

export default function LeaderboardsPage() {
  const [sortBy, setSortBy] = useState("rank")
  const [searchQuery, setSearchQuery] = useState("")

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-700"
      default:
        return "text-gray-600"
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return null
    }
  }

  const filteredData = leaderboardData
    .filter((player) => player.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "totalScore":
          return b.totalScore - a.totalScore
        case "gamesPlayed":
          return b.gamesPlayed - a.gamesPlayed
        case "avgScore":
          return b.avgScore - a.avgScore
        case "accuracy":
          return Number.parseInt(b.accuracy) - Number.parseInt(a.accuracy)
        default:
          return a.rank - b.rank
      }
    })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-[#D41B2C] p-4 text-center shadow-md">
        <h1 className="text-4xl font-bold text-white">Leaderboards</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-2xl font-bold">Top Players</CardTitle>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search players..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rank">Rank</SelectItem>
                    <SelectItem value="totalScore">Total Score</SelectItem>
                    <SelectItem value="gamesPlayed">Games Played</SelectItem>
                    <SelectItem value="avgScore">Average Score</SelectItem>
                    <SelectItem value="accuracy">% Explored</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Total Score</TableHead>
                    <TableHead className="text-right">Games Played</TableHead>
                    <TableHead className="text-right">Avg Score</TableHead>
                    <TableHead className="text-right">% Explored</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((player) => (
                    <TableRow key={player.rank}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getRankIcon(player.rank)}
                          <span className={getRankColor(player.rank)}>#{player.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{player.username}</TableCell>
                      <TableCell className="text-right">{player.totalScore.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{player.gamesPlayed}</TableCell>
                      <TableCell className="text-right">{player.avgScore}</TableCell>
                      <TableCell className="text-right">{player.accuracy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}