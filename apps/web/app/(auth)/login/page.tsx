"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Erro ao criar conta");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou senha incorretos");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Erro inesperado. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            Aprenda Aqui!
          </h1>
          <p className="text-navy/60">
            {isRegister
              ? "Crie sua conta e comece a aprender"
              : "Entre para continuar aprendendo"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-elevation rounded-3xl p-8 border border-navy/5 space-y-4"
        >
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-navy/10 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                placeholder="Seu nome"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-navy/10 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-navy/10 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              placeholder="••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Carregando..."
              : isRegister
                ? "Criar Conta"
                : "Entrar"}
          </Button>

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="w-full text-sm text-navy/60 hover:text-primary transition-colors"
          >
            {isRegister
              ? "Já tem conta? Entrar"
              : "Não tem conta? Criar conta"}
          </button>
        </form>

        {!isRegister && (
          <p className="text-center text-xs text-navy/40 mt-4">
            Demo: demo@aprendaqui.com.br / demo123
          </p>
        )}
      </div>
    </div>
  );
}
