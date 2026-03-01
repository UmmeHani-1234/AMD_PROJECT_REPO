import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Heart, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface VerifiedItem {
  id: string;
  type: string;
  quantity: number;
  clinic: string;
  verified: boolean;
  verifiedAt: string;
}

export default function Recipient() {
  const [, navigate] = useLocation();
  const [inventory, setInventory] = useState<VerifiedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      const donations = JSON.parse(localStorage.getItem("donations") || "[]");
      const verified = donations.filter((d: any) => d.verified);

      // Group by type and clinic
      const grouped: { [key: string]: VerifiedItem } = {};
      verified.forEach((item: any) => {
        const key = `${item.type}-${item.location}`;
        if (grouped[key]) {
          grouped[key].quantity += item.quantity;
        } else {
          grouped[key] = {
            id: item.id,
            type: item.type,
            quantity: item.quantity,
            clinic: `Primary Health Center, ${item.location}`,
            verified: true,
            verifiedAt: item.verifiedAt,
          };
        }
      });

      setInventory(Object.values(grouped));
      setLoading(false);
    }, 500);
  };

  const handleRequest = (item: VerifiedItem) => {
    toast.success(`Request submitted for ${item.type}. Please visit the clinic with your prescription.`);
  };

  const getInhalerLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      salbutamol: "Salbutamol (MDI)",
      "budesonide-formoterol": "Budesonide/Formoterol (DPI)",
      fluticasone: "Fluticasone (MDI)",
      albuterol: "Albuterol (MDI)",
      other: "Other",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-900">VIX</h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Available Life-Saving Supplies
                </h2>
                <p className="text-gray-600">
                  The following supplies have been medically verified and are available for immediate dispensation at the listed clinic hubs.
                </p>
              </div>
              <Button
                onClick={loadInventory}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-gray-700">
                <strong>Important:</strong> A valid prescription from a registered medical practitioner is required for pickup.
              </p>
            </div>

            {/* Inventory Table */}
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                <p className="text-gray-600">Loading verified inventory...</p>
              </div>
            ) : inventory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Inhaler Type
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        Available Units
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Nearest Hub
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-4 text-gray-900 font-medium">
                          {getInhalerLabel(item.type)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                            {item.quantity} units
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {item.clinic}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button
                            onClick={() => handleRequest(item)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Request
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No verified supplies currently available.
                </p>
                <p className="text-gray-500">
                  Check back soon as donations are verified and added to the system.
                </p>
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>How to Request:</strong> Click the "Request" button for the supply you need. You will be guided to visit the clinic with your prescription. All supplies are medically verified and safe for use.
              </p>
            </div>

            {/* Real-time Updates Note */}
            <p className="text-xs text-gray-500 mt-6 text-center">
              Inventory is updated in real-time after clinic verification. Last updated: {new Date().toLocaleTimeString()}
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
