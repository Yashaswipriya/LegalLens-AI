"use client";
import { useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { UploadCloud, Trash2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";

interface Contract {
   _id: string;
  fileName: string;
  uploadDate: string;
  extractedText: string;
  summary: string;
  riskyClauses: {
    type: string;
    text: string;
    reason: string;
  }[];
  suggestions: string[];
  riskScore: number;
}

export default function DashboardPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchContracts = async () => {
    try {
      const res = await axiosInstance.get("/contract");
      setContracts(res.data.contracts);
    } catch (err) {
      toast.error("Failed to load contracts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/contract/${id}`);
      setContracts(prev => prev.filter(c => c._id !== id));
      toast.success("Contract deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      toast.loading("Uploading...", { id: "upload" });
      await axios.post("/contract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Contract uploaded!", { id: "upload" });
      fetchContracts();
    } catch {
      toast.error("Upload failed.", { id: "upload" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-600 text-lg font-semibold">
        Loading contracts...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-600">Contracts Dashboard</h1>
        <div>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-purple-600 text-white hover:bg-purple-700 flex gap-2"
          >
            <UploadCloud size={18} />
            Upload Contract
          </Button>
        </div>
      </div>

      {contracts.length === 0 ? (
        <Card className="p-6 border border-purple-300 text-center text-gray-500">
          No contracts uploaded yet.
        </Card>
      ) : (
        <div className="rounded-xl border border-gray-300 overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow className="bg-purple-100 hover:bg-purple-100 hover:shadow-none">
                    <TableHead className="text-purple-600 text-left p-6">Filename</TableHead>
                    <TableHead className="text-purple-600 text-left p-6">Date Uploaded</TableHead>
                    <TableHead className="text-purple-600 text-left p-6">Risk</TableHead>
                    <TableHead className="text-purple-600 text-right p-6 pr-14">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {contracts.map(contract => {
                    const riskScore = contract.riskScore;
                    let riskLabel = "Pending";
                    let badgeColor = "bg-gray-300 text-gray-800";

                    if (riskScore !== undefined) {
                    if (riskScore >= 3) {
                        riskLabel = "High";
                        badgeColor = "bg-red-100 text-red-600";
                    } else if (riskScore >= 1) {
                        riskLabel = "Medium";
                        badgeColor = "bg-yellow-100 text-yellow-600";
                    } else {
                        riskLabel = "Safe";
                        badgeColor = "bg-green-100 text-green-600";
                    }
                    }

                    return (
                    <TableRow key={contract._id} className="hover:bg-transparent hover:shadow-none">
                        <TableCell>{contract.fileName}</TableCell>
                        <TableCell className="text-left p-4 pl-6">
                        {new Date(contract.uploadDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
                            {riskLabel}
                        </span>
                        </TableCell>
                        <TableCell className="text-right space-x-10">
                        <div className="flex justify-end items-center pr-8 gap-2">
                            <Link
                            href={`/contract/${contract._id}`}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
                            >
                            View
                            </Link>
                            <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(contract._id)}
                            >
                            <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
                    );
                })}
                </TableBody>
            </Table>
        </div>
      )}
    </div>
  );
}
