"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, LogOut, Mail, Save, Settings } from "lucide-react";
import { EditorThemePicker } from "@/components/settings/editor-theme-picker";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { cn } from "@/lib/utils";

const PREFERENCES_KEY = "aprenda-aqui-preferences";

interface UserSettings {
  name: string;
  email: string;
  createdAt: string;
}

interface Preferences {
  dailyReminder: boolean;
  lessonSounds: boolean;
  rankingUpdates: boolean;
}

const DEFAULT_PREFERENCES: Preferences = {
  dailyReminder: true,
  lessonSounds: true,
  rankingUpdates: false,
};

function loadPreferences(): Preferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(prefs: Preferences) {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      className="flex items-center justify-between gap-4 py-4 border-b-2 border-surface-container-highest last:border-0 cursor-pointer group"
      onClick={() => onChange(!checked)}
    >
      <div>
        <h4 className="font-bold text-on-background">{label}</h4>
        <p className="text-sm text-secondary mt-0.5">{description}</p>
      </div>
      <div
        role="switch"
        aria-checked={checked}
        className={cn(
          "relative w-12 h-7 rounded-full transition-colors shrink-0",
          checked ? "bg-primary-container" : "bg-surface-variant"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5"
          )}
        />
      </div>
    </label>
  );
}

export function SettingsPanel({ user }: { user: UserSettings }) {
  const router = useRouter();
  const { update } = useSession();

  const [activeTab, setActiveTab] = useState<"perfil" | "conta" | "notificacoes" | "aparencia">("perfil");

  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);

  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setPreferences(loadPreferences());
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    setSavingProfile(true);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setProfileError(data.error ?? "Erro ao salvar perfil");
        return;
      }

      await update({ name: data.name });
      setProfileMessage("Perfil atualizado com sucesso!");
      router.refresh();
      setTimeout(() => setProfileMessage(null), 3000);
    } catch {
      setProfileError("Erro de conexão. Tente novamente.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setPasswordError(data.error ?? "Erro ao alterar senha");
        return;
      }

      setPasswordMessage("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMessage(null), 3000);
    } catch {
      setPasswordError("Erro de conexão. Tente novamente.");
    } finally {
      setSavingPassword(false);
    }
  }

  function handlePreferenceChange(key: keyof Preferences, value: boolean) {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    savePreferences(next);
  }

  const inputClass =
    "w-full p-4 bg-surface-container rounded-xl border-2 border-surface-variant focus:border-secondary focus:ring-0 outline-none transition-all font-body-md";

  const tabs = [
    { id: "perfil", label: "Perfil" },
    { id: "conta", label: "Conta" },
    { id: "notificacoes", label: "Notificações" },
    { id: "aparencia", label: "Aparência" },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Settings className="text-primary h-8 w-8" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-on-background font-display tracking-tight">
          Configurações
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-3 mb-8 pb-2 custom-scrollbar whitespace-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-2.5 font-bold rounded-full transition-all",
              activeTab === tab.id
                ? "bg-primary text-white block-shadow-primary active:translate-y-1 active:shadow-none"
                : "bg-surface-container-high text-secondary hover:bg-surface-variant"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Perfil Tab */}
        {activeTab === "perfil" && (
          <section className="bg-surface-container-lowest p-6 md:p-10 rounded-4xl border-2 border-surface-variant block-shadow-card">
            <h2 className="text-xl font-extrabold mb-8 text-secondary border-b-2 border-surface-variant pb-4 font-display">
              Perfil Público
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative shrink-0">
                  <div className="grid w-32 h-32 place-items-center rounded-full border-4 border-primary-container ring-4 ring-surface bg-gradient-to-br from-primary-container to-primary shadow-inner">
                    <span className="font-display text-5xl font-black leading-none text-on-primary-container">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex-grow w-full space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                      Nome de exibição
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      maxLength={80}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-surface-variant flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-grow">
                  {profileError && <p className="text-sm font-bold text-error">{profileError}</p>}
                  {profileMessage && <p className="text-sm font-bold text-primary">{profileMessage}</p>}
                </div>
                <button
                  type="submit"
                  disabled={savingProfile || name.trim() === user.name}
                  className="w-full sm:w-auto px-8 py-3 bg-primary-container text-on-primary-container font-black rounded-xl border-b-4 border-primary block-shadow-primary disabled:opacity-50 disabled:cursor-not-allowed bouncy-transition hover:brightness-110 flex items-center justify-center gap-2"
                >
                  <Save className="h-5 w-5" />
                  {savingProfile ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Conta Tab */}
        {activeTab === "conta" && (
          <div className="space-y-8">
            <section className="bg-surface-container-lowest p-6 md:p-10 rounded-4xl border-2 border-surface-variant block-shadow-card">
              <h2 className="text-xl font-extrabold mb-8 text-secondary border-b-2 border-surface-variant pb-4 font-display">
                Informações da Conta
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className={cn(inputClass, "pl-12 opacity-60 cursor-not-allowed")}
                    />
                  </div>
                  <p className="text-xs text-outline mt-1 font-bold">O email não pode ser alterado.</p>
                </div>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-6 md:p-10 rounded-4xl border-2 border-surface-variant block-shadow-card">
              <h2 className="text-xl font-extrabold mb-8 text-secondary border-b-2 border-surface-variant pb-4 font-display">
                Segurança
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                    Senha atual
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={inputClass}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                      Nova senha
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputClass}
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                      Confirmar nova senha
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass}
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-surface-variant flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-grow">
                    {passwordError && <p className="text-sm font-bold text-error">{passwordError}</p>}
                    {passwordMessage && <p className="text-sm font-bold text-primary">{passwordMessage}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full sm:w-auto px-8 py-3 bg-secondary text-white font-black rounded-xl border-b-4 border-on-secondary-fixed block-shadow-secondary disabled:opacity-50 bouncy-transition flex items-center justify-center gap-2"
                  >
                    <Lock className="h-5 w-5" />
                    {savingPassword ? "Alterando..." : "Alterar Senha"}
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-error-container/10 p-6 md:p-10 rounded-4xl border-2 border-error/20">
              <h2 className="text-xl font-extrabold mb-4 text-error font-display">
                Zona de Perigo
              </h2>
              <p className="text-on-surface-variant mb-6 font-medium">
                Encerre sua sessão neste dispositivo ou exclua sua conta permanentemente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="px-6 py-3 bg-surface border-2 border-error/30 text-error font-bold rounded-xl hover:bg-error-container/30 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Sair da Conta
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Notificações Tab */}
        {activeTab === "notificacoes" && (
          <section className="bg-surface-container-lowest p-6 md:p-10 rounded-4xl border-2 border-surface-variant block-shadow-card">
            <h2 className="text-xl font-extrabold mb-8 text-secondary border-b-2 border-surface-variant pb-4 font-display">
              Notificações e Alertas
            </h2>
            <div className="space-y-2">
              <ToggleRow
                label="Lembretes de Estudo"
                description="Avisaremos você quando for hora de praticar para manter sua ofensiva."
                checked={preferences.dailyReminder}
                onChange={(v) => handlePreferenceChange("dailyReminder", v)}
              />
              <ToggleRow
                label="Sons nas Lições"
                description="Reproduzir efeitos sonoros ao acertar ou errar exercícios."
                checked={preferences.lessonSounds}
                onChange={(v) => handlePreferenceChange("lessonSounds", v)}
              />
              <ToggleRow
                label="Atualizações do Ranking"
                description="Saiba quando você subir de liga ou for ultrapassado."
                checked={preferences.rankingUpdates}
                onChange={(v) => handlePreferenceChange("rankingUpdates", v)}
              />
            </div>
          </section>
        )}

        {/* Aparência Tab */}
        {activeTab === "aparencia" && (
          <section className="bg-surface-container-lowest p-6 md:p-10 rounded-4xl border-2 border-surface-variant block-shadow-card">
            <h2 className="text-xl font-extrabold mb-8 text-secondary border-b-2 border-surface-variant pb-4 font-display">
              Aparência
            </h2>
            <div className="space-y-10">
              <div className="max-w-md space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">
                  Tema do aplicativo
                </h3>
                <ThemeSelector />
              </div>
              <div className="border-t-2 border-surface-variant pt-10">
                <EditorThemePicker />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
