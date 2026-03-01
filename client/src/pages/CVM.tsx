import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Heart, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface DonationItem {
  id: string;
  type: string;
  expiry: string;
  quantity: number;
  location: string;
  timestamp: string;
  verified: boolean;
}

interface VerificationLog {
  itemId: string;
  hash: string;
  timestamp: string;
  clinicId: string;
}

export default function CVM() {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [pendingDonations, setPendingDonations] = useState<DonationItem[]>([]);
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);
  const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [checklist, setChecklist] = useState({
    sealIntact: false,
    expiryConfirmed: false,
    noDamage: false,
  });

  useEffect(() => {
    loadPendingDonations();
    loadVerificationLogs();
  }, []);

  const loadPendingDonations = () => {
    const donations = JSON.parse(localStorage.getItem("donations") || "[]");
    const pending = donations.filter((d: any) => !d.verified);
    setPendingDonations(pending);
  };

  const loadVerificationLogs = () => {
    const logs = JSON.parse(localStorage.getItem("verificationLogs") || "[]");
    setVerificationLogs(logs);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "clinic123") {
      setIsAuthenticated(true);
      toast.success("Authenticated as Clinic Staff");
      setPassword("");
    } else {
      toast.error("Invalid password");
    }
  };

  const handleVerifyClick = (item: DonationItem) => {
    setSelectedItem(item);
    setChecklist({ sealIntact: false, expiryConfirmed: false, noDamage: false });
    setShowVerificationModal(true);
  };

  // Simple SHA-256 simulation (not cryptographically secure, for demo only)
  const simulateSHA256 = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(64, "0");
  };

  const handleLogVerification = () => {
    if (!selectedItem) return;

    // Validate checklist
    if (!checklist.sealIntact || !checklist.expiryConfirmed || !checklist.noDamage) {
      toast.error("Please complete all verification checks");
      return;
    }

    // Create verification log entry
    const logData = `${selectedItem.id}-${new Date().toISOString()}-CLINIC-001`;
    const hash = simulateSHA256(logData);

    const newLog: VerificationLog = {
      itemId: selectedItem.id,
      hash: hash,
      timestamp: new Date().toISOString(),
      clinicId: "CLINIC-001",
    };

    // Update donation as verified
    const donations = JSON.parse(localStorage.getItem("donations") || "[]");
    const updatedDonations = donations.map((d: any) =>
      d.id === selectedItem.id ? { ...d, verified: true, verifiedAt: new Date().toISOString() } : d
    );
    localStorage.setItem("donations", JSON.stringify(updatedDonations));

    // Add to verification logs
    const logs = JSON.parse(localStorage.getItem("verificationLogs") || "[]");
    logs.push(newLog);
    localStorage.setItem("verificationLogs", JSON.stringify(logs));

    // Update UI
    loadPendingDonations();
    loadVerificationLogs();
    setShowVerificationModal(false);
    setSelectedItem(null);

    toast.success("Item verified and logged to audit trail!");
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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

        {/* Login Form */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="p-8">
              <div className="flex justify-center mb-6">
                <Lock className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Clinic Verification Module
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Only authorized clinic staff can access this module.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter clinic password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Demo password: clinic123</p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 font-semibold"
                >
                  Login
                </Button>
              </form>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-900">VIX</h1>
              <span className="ml-4 text-sm text-gray-600">
                Logged in as: Dr. [Clinic ID: CLINIC-001]
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setIsAuthenticated(false);
                navigate("/");
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Pending Donations for Verification
            </h2>
            <p className="text-gray-600 mb-6">
              Only medically trained personnel are authorized to perform verification. Verification logs are immutable and recorded on the audit trail.
            </p>

            {/* Pending Donations Table */}
            {pendingDonations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Donation ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Item Type
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        Qty
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Expiry
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Location
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDonations.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-4 font-mono text-sm text-blue-600">
                          {item.id}
                        </td>
                        <td className="py-4 px-4 text-gray-900">
                          {getInhalerLabel(item.type)}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-4 text-gray-900">
                          {new Date(item.expiry).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {item.location}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button
                            onClick={() => handleVerifyClick(item)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Verify Item
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No pending donations to verify.
                </p>
              </div>
            )}
          </Card>

          {/* Verification Logs */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Immutable Verification Audit Trail
            </h3>
            {verificationLogs.length > 0 ? (
              <div className="space-y-4">
                {verificationLogs.map((log, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Item ID</p>
                        <p className="font-mono text-sm text-blue-600">{log.itemId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Verified At</p>
                        <p className="text-sm text-gray-900">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Clinic ID</p>
                        <p className="text-sm text-gray-900">{log.clinicId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">DLT Hash</p>
                        <p className="font-mono text-xs text-gray-700 truncate">
                          {log.hash}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No verification logs yet. Verified items will appear here.
              </p>
            )}
          </Card>
        </div>
      </main>

      {/* Verification Modal */}
      {showVerificationModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Verify Item: {selectedItem.id}
            </h3>

            <div className="space-y-4 mb-8">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Type:</strong> {getInhalerLabel(selectedItem.type)}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Expiry:</strong> {new Date(selectedItem.expiry).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Quantity:</strong> {selectedItem.quantity}
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.sealIntact}
                    onChange={(e) =>
                      setChecklist((prev) => ({
                        ...prev,
                        sealIntact: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-gray-900">Seal is intact and undamaged</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.expiryConfirmed}
                    onChange={(e) =>
                      setChecklist((prev) => ({
                        ...prev,
                        expiryConfirmed: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-gray-900">Expiry date confirmed and valid</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.noDamage}
                    onChange={(e) =>
                      setChecklist((prev) => ({
                        ...prev,
                        noDamage: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-gray-900">No physical damage or contamination</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowVerificationModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogVerification}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Log Verification to Ledger
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
