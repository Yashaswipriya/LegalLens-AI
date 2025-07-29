"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { login, signup } from "@/utils/authClient";
import { useRouter } from "next/navigation";


type AuthModalProps = {
  mode: "login" | "signup";
  onClose: () => void;
  onSuccess: () => void;
};

export default function AuthModal({ mode, onClose, onSuccess }: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (mode === "signup" && !formData.name)) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      if (mode === "signup") {
        await signup(formData);
        toast.success("Signup successful!");
      } else {
        await login(formData);
        toast.success("Login successful!");
      }

      onSuccess();
      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#1f1f1f] rounded-xl p-6 w-full max-w-md relative border border-gray-600">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 capitalize text-white">{mode}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded text-white focus:outline-none"
              />
            </div>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded text-white focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded text-white focus:outline-none"
            />
          </div>

          <Button className="w-full bg-white text-black hover:bg-gray-300" disabled={loading}>
            {loading ? "Please wait..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
