"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

interface EligibilityResponse {
  total: number;
  totalUnclaimed: number;
  categories: Array<{
    category: string;
    items: Array<{
      address: string;
      amount: number;
    }>;
    total: number;
  }>;
}

export default function AirdropChecker() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResponse | null>(null);
  const [error, setError] = useState("");

  const checkEligibility = async () => {
    if (!wallet) {
      setError("Please enter a wallet address");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `https://api.clusters.xyz/v0.1/airdrops/pengu/eligibility/${wallet}`
      );

      if (!response.ok) {
        throw new Error("Failed to check eligibility");
      }

      const data: EligibilityResponse = await response.json();
      setResult(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to check eligibility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Pengu Airdrop Checker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter Solana wallet address"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={checkEligibility}
                disabled={loading}
                className="w-32"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking
                  </>
                ) : (
                  "Check"
                )}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <X className="h-5 w-5" />
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-blue-50">
                    <div className="text-sm text-blue-600">Total Tokens</div>
                    <div className="text-2xl font-bold">{result.total}</div>
                  </Card>
                  <Card className="p-4 bg-green-50">
                    <div className="text-sm text-green-600">Unclaimed</div>
                    <div className="text-2xl font-bold">
                      {result.totalUnclaimed}
                    </div>
                  </Card>
                </div>

                {result.categories.map((category, idx) => (
                  <Card key={idx} className="p-4 bg-slate-50">
                    <div className="font-medium text-lg mb-2">
                      {category.category}
                    </div>
                    <div className="space-y-2">
                      {category.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex justify-between items-center p-2 bg-white rounded-lg"
                        >
                          <div className="text-sm text-slate-600 truncate max-w-[200px]">
                            {item.address}
                          </div>
                          <div className="font-medium">
                            {item.amount} tokens
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t">
                        <div className="font-medium">Total in category</div>
                        <div className="font-bold">{category.total}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
