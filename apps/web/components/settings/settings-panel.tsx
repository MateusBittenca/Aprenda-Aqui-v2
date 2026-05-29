"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  Lock,
  LogOut,
  Mail,
  Moon,
  Save,
  User,
} from "lucide-react";
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

function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <section className="card-elevation rounded-4xl p-6 border-2 border-surface-container-highest">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-on-background font-display">{title}</h2>
          {description && (
            <p className="text-sm text-on-surface-variant mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
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
    <label className="flex items-center justify-between gap-4 py-3 border-b border-surface-container-highest last:border-0 cursor-pointer">
      <div>
        <p className="font-bold text-on-background text-sm">{label}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-12 h-7 rounded-full transition-colors shrink-0",
          checked ? "bg-primary-container" : "bg-surface-container-highest"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-5 h-5 rounded-full bg-surface-container-lowest shadow transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </label>
  );
}

export function SettingsPanel({ user }: { user: UserSettings }) {
  const router = useRouter();
  const { update } = useSession();

  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);

  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [prefsMessage, setPrefsMessage] = useState<string | null>(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setPreferences(loadPreferences());
  }, []);

  const memberSince = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));

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
    setPrefsMessage("Preferências salvas!");
    setTimeout(() => setPrefsMessage(null), 2000);
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border-2 border-surface-container-highest bg-surface-container-lowest text-on-background font-medium text-sm focus:outline-none focus:border-primary-container transition-colors";

  return (
    <div className="max-w-[640px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-on-background font-display">
          Configurações
        </h1>
        <p className="text-on-surface-variant mt-1">
          Gerencie sua conta e preferências de aprendizado.
        </p>
      </div>

      <SettingsSection
        title="Conta"
        description={`Membro desde ${memberSince}`}
        icon={User}
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">
              Nome
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

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
              <input
                type="email"
                value={user.email}
                disabled
                className={cn(inputClass, "pl-10 opacity-60 cursor-not-allowed")}
              />
            </div>
            <p className="text-xs text-outline mt-1">O email não pode ser alterado.</p>
          </div>

          {profileError && (
            <p className="text-sm font-bold text-error">{profileError}</p>
          )}
          {profileMessage && (
            <p className="text-sm font-bold text-primary">{profileMessage}</p>
          )}

          <button
            type="submit"
            disabled={savingProfile || name.trim() === user.name}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary-container font-bold rounded-xl border-b-4 border-primary block-shadow-primary disabled:opacity-50 disabled:cursor-not-allowed bouncy-transition"
          >
            <Save className="h-4 w-4" />
            {savingProfile ? "Salvando..." : "Salvar perfil"}
          </button>
        </form>
      </SettingsSection>

      <SettingsSection
        title="Segurança"
        description="Altere sua senha de acesso"
        icon={Lock}
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">
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
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">
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
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">
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

          {passwordError && (
            <p className="text-sm font-bold text-error">{passwordError}</p>
          )}
          {passwordMessage && (
            <p className="text-sm font-bold text-primary">{passwordMessage}</p>
          )}

          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-on-secondary font-bold rounded-xl border-b-4 border-on-secondary-fixed block-shadow-secondary disabled:opacity-50 bouncy-transition"
          >
            <Lock className="h-4 w-4" />
            {savingPassword ? "Alterando..." : "Alterar senha"}
          </button>
        </form>
      </SettingsSection>

      <SettingsSection
        title="Aparência"
        description="Escolha como a interface é exibida"
        icon={Moon}
      >
        <ThemeSelector />
      </SettingsSection>

      <SettingsSection
        title="Preferências"
        description="Personalize sua experiência de estudo"
        icon={Bell}
      >
        <ToggleRow
          label="Lembrete diário"
          description="Receba um aviso para manter sua ofensiva"
          checked={preferences.dailyReminder}
          onChange={(v) => handlePreferenceChange("dailyReminder", v)}
        />
        <ToggleRow
          label="Sons nas lições"
          description="Efeitos sonoros ao acertar ou errar"
          checked={preferences.lessonSounds}
          onChange={(v) => handlePreferenceChange("lessonSounds", v)}
        />
        <ToggleRow
          label="Atualizações do ranking"
          description="Saiba quando subir ou descer de posição"
          checked={preferences.rankingUpdates}
          onChange={(v) => handlePreferenceChange("rankingUpdates", v)}
        />
        {prefsMessage && (
          <p className="text-sm font-bold text-primary mt-3">{prefsMessage}</p>
        )}
      </SettingsSection>

      <SettingsSection title="Aprendizado" icon={BookOpen}>
        <p className="text-sm text-on-surface-variant mb-4">
          Ajustes relacionados às trilhas e ao progresso.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/trilhas"
            className="px-4 py-2 rounded-xl border-2 border-surface-container-highest font-bold text-sm text-on-background hover:border-primary-container hover:bg-primary-container/5 transition-colors"
          >
            Ver trilhas
          </a>
          <a
            href="/perfil"
            className="px-4 py-2 rounded-xl border-2 border-surface-container-highest font-bold text-sm text-on-background hover:border-primary-container hover:bg-primary-container/5 transition-colors"
          >
            Meu perfil
          </a>
        </div>
      </SettingsSection>

      <section className="card-elevation rounded-4xl p-6 border-2 border-error/20 bg-error-container/10">
        <h2 className="text-lg font-extrabold text-error mb-2 font-display">Sessão</h2>
        <p className="text-sm text-on-surface-variant mb-4">
          Encerre sua sessão neste dispositivo.
        </p>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface border-2 border-error/30 text-error font-bold rounded-xl hover:bg-error-container/30 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </button>
      </section>
    </div>
  );
}
