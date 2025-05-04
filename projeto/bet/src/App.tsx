import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";

type Match = {
  _id: Id<"matches">;
  _creationTime: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: number;
  status?: "scheduled" | "live" | "finished";
};

type Bet = {
  _id: Id<"bets">;
  _creationTime: number;
  matchId: Id<"matches">;
  userId: Id<"users">;
  picks: string[];
  size?: "small" | "medium" | "large";
  status?: "imaginary" | "ready" | "live" | "saved" | "finished";
  result?: "won" | "lost" | "void";
  createdAt?: number;
  odds?: number;
  isAdmin?: boolean;
};

function LoginWrapper() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Apostas</h1>
        <SignInForm />
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"imaginary" | "ready" | "live" | "saved">("imaginary");
  const user = useQuery(api.auth.loggedInUser);

  // Only fetch data if user is logged in
  const matches = useQuery(api.matches.list, user ? {} : "skip") ?? [];
  const imaginaryBets = useQuery(api.matches.getImaginaryBets, user ? {} : "skip") ?? [];
  const readyBets = useQuery(api.matches.getReadyBets, user ? {} : "skip") ?? [];
  const liveBets = useQuery(api.matches.getLiveBets, user ? {} : "skip") ?? [];
  const savedBets = useQuery(api.matches.getSavedBets, user ? {} : "skip") ?? [];
  
  const generateBet = useMutation(api.matches.generateImaginaryBet);
  const saveBet = useMutation(api.matches.saveBet);
  const deleteBet = useMutation(api.matches.deleteBet);
  const clearBets = useMutation(api.matches.clearBets);
  const adminAddBet = useMutation(api.matches.adminAddBet);
  const adminUpdateBet = useMutation(api.matches.adminUpdateBet);

  if (!user) {
    return <LoginWrapper />;
  }

  const isAdmin = user.name === "e-web";

  const getBetsForTab = (): Bet[] => {
    switch (activeTab) {
      case "imaginary":
        return imaginaryBets;
      case "ready":
        return readyBets;
      case "live":
        return liveBets;
      case "saved":
        return savedBets;
      default:
        return [];
    }
  };

  const handleGenerateBet = async (matchId: Id<"matches">, size: "small" | "medium" | "large") => {
    try {
      await generateBet({ matchId, size });
    } catch (error) {
      console.error("Error generating bet:", error);
    }
  };

  const handleSaveBet = async (betId: Id<"bets">) => {
    try {
      await saveBet({ betId });
    } catch (error) {
      console.error("Error saving bet:", error);
    }
  };

  const handleDeleteBet = async (betId: Id<"bets">) => {
    try {
      await deleteBet({ betId });
    } catch (error) {
      console.error("Error deleting bet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Apostas</h1>
          <SignOutButton />
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("imaginary")}
            className={`px-4 py-2 rounded ${
              activeTab === "imaginary" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Mágicas
          </button>
          <button
            onClick={() => setActiveTab("ready")}
            className={`px-4 py-2 rounded ${
              activeTab === "ready" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Prontas
          </button>
          <button
            onClick={() => setActiveTab("live")}
            className={`px-4 py-2 rounded ${
              activeTab === "live" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Ao Vivo
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 rounded ${
              activeTab === "saved" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Salvas
          </button>
        </div>

        <div className="grid gap-4">
          {activeTab === "imaginary" && matches.map((match: Match) => (
            <div key={match._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {match.homeTeam} vs {match.awayTeam}
                  </h2>
                  <p className="text-gray-600">{match.league}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(match.startTime).toLocaleString()}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleGenerateBet(match._id, "small")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Aposta Pequena
                  </button>
                  <button
                    onClick={() => handleGenerateBet(match._id, "medium")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Aposta Média
                  </button>
                  <button
                    onClick={() => handleGenerateBet(match._id, "large")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Aposta Grande
                  </button>
                </div>
              </div>

              {getBetsForTab()
                .filter((bet: Bet) => bet.matchId === match._id)
                .map((bet: Bet) => (
                  <div
                    key={bet._id}
                    className="bg-gray-50 p-3 rounded border border-gray-200 mt-2"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Tamanho: {bet.size} ({bet.picks.length} picks)
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {bet.picks.map((pick: string, index: number) => (
                            <li key={index}>{pick}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveBet(bet._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => handleGenerateBet(match._id, bet.size ?? "small")}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Gerar Nova
                        </button>
                        <button
                          onClick={() => handleDeleteBet(bet._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}

          {(activeTab === "ready" || activeTab === "live") && (
            <div className="grid gap-4">
              {getBetsForTab().map((bet: Bet) => {
                const match = matches.find((m: Match) => m._id === bet.matchId);
                return (
                  <div key={bet._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {match?.homeTeam} vs {match?.awayTeam}
                        </h2>
                        <p className="text-gray-600">{match?.league}</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                          {bet.picks.map((pick: string, index: number) => (
                            <li key={index}>{pick}</li>
                          ))}
                        </ul>
                        {bet.odds && (
                          <p className="text-blue-600 font-semibold mt-2">
                            Odds: {bet.odds}
                          </p>
                        )}
                      </div>
                      {isAdmin && (
                        <div className="space-y-2">
                          <button
                            onClick={() => adminUpdateBet({
                              betId: bet._id,
                              status: "finished",
                              result: "won"
                            })}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 block"
                          >
                            Ganhou
                          </button>
                          <button
                            onClick={() => adminUpdateBet({
                              betId: bet._id,
                              status: "finished",
                              result: "lost"
                            })}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 block"
                          >
                            Perdeu
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="grid gap-4">
              {savedBets.map((bet: Bet) => {
                const match = matches.find((m: Match) => m._id === bet.matchId);
                return (
                  <div key={bet._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {match?.homeTeam} vs {match?.awayTeam}
                        </h2>
                        <p className="text-gray-600">{match?.league}</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                          {bet.picks.map((pick: string, index: number) => (
                            <li key={index}>{pick}</li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => handleDeleteBet(bet._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
