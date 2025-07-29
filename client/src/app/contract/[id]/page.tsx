"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, CheckCircle, FileText, Lightbulb, } from "lucide-react";
import jsPDF from "jspdf";

interface RiskyClause {
  type: string;
  text: string;
  reason: string;
}

interface Contract {
  fileName: string;
  extractedText: string;
  summary: string;
  riskyClauses: RiskyClause[];
  suggestions: string[];
  riskScore: number;
  [key: string]: any;
}

export default function ContractDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/contract/${id}`)
        .then((response) => {
          console.log("Full contract response:", response.data);
          setContract(response.data.contract);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching contract:", err.response?.data || err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading...</div>;
  }

  if (!contract) {
    return <div className="p-8 text-center text-red-500">Contract not found.</div>;
  }

const { fileName, summary, riskyClauses, suggestions } = contract;

const handleDownload = () => {
  if (!contract) return;

  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(16);
  doc.text(`Contract Report: ${contract.fileName}`, 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text("Summary:", 10, y);
  y += 8;
  doc.setFont("normal");
  const summaryLines = doc.splitTextToSize(contract.summary || "No summary available", 180);
  doc.text(summaryLines, 10, y);
  y += summaryLines.length * 7 + 5;

  if (contract.riskyClauses?.length) {
    doc.setFont("bold");
    doc.text("Risky Clauses:", 10, y);
    y += 8;
    doc.setFont("normal");

    contract.riskyClauses.forEach((clause, index) => {
      const clauseLines = doc.splitTextToSize(
        `${index + 1}. Type: ${clause.type}\nClause: "${clause.text}"\nReason: ${clause.reason}`,
        180
      );
      doc.text(clauseLines, 10, y);
      y += clauseLines.length * 7 + 4;

      // Add page if content goes beyond page height
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
  } else {
    doc.text("No risky clauses found.", 10, y);
    y += 10;
  }

  if (contract.suggestions?.length) {
    doc.setFont("bold");
    doc.text("Suggestions:", 10, y);
    y += 8;
    doc.setFont("normal");
    contract.suggestions.forEach((tip, idx) => {
      const tipLines = doc.splitTextToSize(`${idx + 1}. ${tip}`, 180);
      doc.text(tipLines, 10, y);
      y += tipLines.length * 7 + 4;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
  }

  doc.save(`${contract.fileName}_Report.pdf`);
};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft size={18} /> Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-800">{fileName}</h1>
      </div>
      <Button
        onClick={handleDownload}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Download PDF
      </Button>
    </div>
    
  {/* Summary Section */}
  <Card className="mb-6 border-l-4 border-purple-400 shadow-sm">
    <CardContent className="p-5">
      <h2 className="text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-purple-500" />
        Summary
        </h2>
      <p className="text-gray-700 leading-relaxed">
        {summary || <span className="text-gray-400 italic">No summary available</span>}
      </p>
    </CardContent>
  </Card>

  {/* Risky Clauses Section */}
 {riskyClauses?.length > 0 ? (
  <Card className="mb-6 border-l-4 border-red-400">
    <CardContent className="p-5">
      <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        Risky Clauses
      </h2>
      <div className="space-y-4">
        {contract?.riskyClauses.map((clause: RiskyClause, index: number) => (
          <Card
            key={index}
            className="border border-red-200 bg-red-50 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-5 space-y-2">
              <h3 className="flex items-center gap-2 text-red-700 font-medium">
                <AlertTriangle className="w-4 h-4 text-red-700" />
                {clause.type}
              </h3>
              <p className="text-sm text-gray-700 italic">"{clause.text}"</p>
              <p className="text-sm text-gray-800">
                <span className="font-semibold text-md">Reason: </span>
                {clause.reason}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
) : (
  <div className="text-sm text-gray-600 border-l-4 border-green-300 bg-green-50 p-4 rounded mb-6">
    ✅ This contract does not contain any risky clauses based on our analysis.
  </div>
)}

  {/* Suggestions Section */}
  {suggestions?.length > 0 && (
    <Card className="border-l-4 border-green-400">
      <CardContent className="p-5">
        <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-green-500" />
        Suggestions
        </h2>
         <ul className="space-y-2">
      {(suggestions as string[]).map((tip, idx) => (
        <li key={idx} className="break-words flex items-start gap-2 text-gray-800">
          <CheckCircle className="w-4 h-4 mt-1 shrink-0 text-green-500" />
          <span>{tip}</span>
        </li>
      ))}
    </ul>
      </CardContent>
    </Card>
  )}
</div>

  );
}