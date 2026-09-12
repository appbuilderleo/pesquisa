"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart2, Users, MapPin, TrendingUp, LogOut, Download,
  RefreshCw, ChevronLeft, ChevronRight, Eye, Trash2, X,
  ClipboardList, Store, AlertTriangle, Smartphone, Wifi,
  Calendar, Search,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const COLORS = ["#2e7d5e", "#3fada8", "#57c3a0", "#7dd3c0", "#a7e8da", "#c8f3ea", "#e2faf4"];
const ACCENT = "#f97316";

// ---- Helpers ----
function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-lg border bg-card shadow-sm p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-base font-semibold mb-4 flex items-center gap-2">{title}</h2>;
}

function truncate(str: string, max = 18) {
  return str && str.length > max ? str.substring(0, max) + "…" : str;
}

// ---- Types ----
interface Survey {
  id: string;
  entrevistador: string;
  data_entrevista: string;
  hora_entrevista?: string;
  bairro_zona: string;
  numero_formulario?: string;
  tipo_estabelecimento: string[];
  tempo_aberto?: string;
  disposicao_uso?: string;
  disposicao_pagar?: string;
  created_at: string;
}

interface Stats {
  total: number;
  bairros: number;
  disposicaoUso: { disposicao_uso: string; count: string }[];
  disposicaoPagar: { disposicao_pagar: string; count: string }[];
  tipoEstabelecimento: { name: string; value: number }[];
  maiorProblema: { name: string; value: number }[];
  controloVendas: { name: string; value: number }[];
  prioridades: Record<string, number>;
  timeline: { dia: string; count: string }[];
  operadores: { operador_movel: string; count: string }[];
  qualidadeInternet: { qualidade_internet: string; count: string }[];
  electricidade: { electricidade: string; count: string }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterEntrevistador, setFilterEntrevistador] = useState("");
  const [filterBairro, setFilterBairro] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const LIMIT = 20;

  // Auth check
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (d.user) setUser(d.user);
        else router.push("/login");
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const r = await fetch("/api/dashboard/stats");
      const d = await r.json();
      setStats(d);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        entrevistador: filterEntrevistador,
        bairro: filterBairro,
      });
      const r = await fetch(`/api/surveys?${params}`);
      const d = await r.json();
      setSurveys(d.surveys || []);
      setTotal(d.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, filterEntrevistador, filterBairro]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchSurveys(); }, [fetchSurveys]);

  async function viewSurvey(id: string) {
    const r = await fetch(`/api/surveys/${id}`);
    const d = await r.json();
    setSelectedSurvey(d.survey);
  }

  async function deleteSurvey(id: string) {
    if (!confirm("Tem a certeza que quer eliminar esta entrevista?")) return;
    await fetch(`/api/surveys/${id}`, { method: "DELETE" });
    fetchSurveys();
    fetchStats();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  function downloadCSV() {
    if (!surveys.length) return;
    const headers = ["ID", "Entrevistador", "Data", "Bairro", "Tipo Estab.", "Disposição", "Preço"];
    const rows = surveys.map(s => [
      s.id,
      s.entrevistador,
      s.data_entrevista ? new Date(s.data_entrevista).toLocaleDateString("pt-MZ") : "",
      s.bairro_zona,
      Array.isArray(s.tipo_estabelecimento) ? s.tipo_estabelecimento.join("; ") : "",
      s.disposicao_uso || "",
      s.disposicao_pagar || "",
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pesquisa_stoka_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Prioridades para Radar
  const prioridadesData = stats?.prioridades
    ? Object.entries(stats.prioridades).map(([label, value]) => ({ label: truncate(label, 22), value }))
    : [];

  const disposicaoData = stats?.disposicaoUso.map(d => ({
    name: truncate(d.disposicao_uso, 22),
    value: parseInt(d.count),
  })) || [];

  const pagarData = stats?.disposicaoPagar.map(d => ({
    name: truncate(d.disposicao_pagar, 22),
    value: parseInt(d.count),
  })) || [];

  const timelineData = stats?.timeline.map(t => ({
    dia: t.dia ? new Date(t.dia).toLocaleDateString("pt-MZ", { day: "2-digit", month: "2-digit" }) : "",
    count: parseInt(t.count),
  })) || [];

  const totalPages = Math.ceil(total / LIMIT);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b bg-card sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">STOKA</span>
              <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">Dashboard Analítico</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.name}</span>
            <a href="/" className="text-xs text-primary hover:underline hidden sm:block">Formulário</a>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* KPIs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-bold text-2xl tracking-tight">Visão Geral</h1>
            <button
              onClick={() => { fetchStats(); fetchSurveys(); }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${statsLoading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
          </div>
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card h-32 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={ClipboardList} label="Total de Entrevistas" value={stats?.total || 0} />
              <StatCard icon={MapPin} label="Bairros Cobertos" value={stats?.bairros || 0} />
              <StatCard
                icon={TrendingUp}
                label="Interesse em App"
                value={stats ? `${Math.round(
                  (stats.disposicaoUso.filter(d => d.disposicao_uso === "Com certeza que sim").reduce((s, d) => s + parseInt(d.count), 0) /
                    Math.max(stats.total, 1)) * 100
                )}%` : "0%"}
                sub="responderam «Com certeza que sim»"
              />
              <StatCard
                icon={Users}
                label="Top Dor"
                value={stats?.maiorProblema?.[0]?.name ? truncate(stats.maiorProblema[0].name, 20) : "—"}
                sub={stats?.maiorProblema?.[0]?.value ? `${stats.maiorProblema[0].value} respostas` : undefined}
              />
            </div>
          )}
        </section>

        {/* Charts Row 1 */}
        {stats && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tipo Estabelecimento */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <SectionTitle title="Tipo de Estabelecimento" />
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.tipoEstabelecimento.slice(0, 7)} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }}
                    tickFormatter={v => truncate(v, 18)} />
                  <Tooltip formatter={(v) => [v, "Respostas"]} />
                  <Bar dataKey="value" fill="#2e7d5e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Maiores Problemas */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <SectionTitle title="Maiores Problemas no Negócio" />
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.maiorProblema.slice(0, 6)} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }}
                    tickFormatter={v => truncate(v, 22)} />
                  <Tooltip formatter={(v) => [v, "Respostas"]} />
                  <Bar dataKey="value" fill={ACCENT} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Charts Row 2 */}
        {stats && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Disposição de Uso */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <SectionTitle title="Disposição para Usar App" />
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={disposicaoData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) =>
                    `${truncate(name, 14)} ${Math.round(percent * 100)}%`
                  } labelLine={false} fontSize={11}>
                    {disposicaoData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [v, "Respostas"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Faixa de Preço */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <SectionTitle title="Preço Aceite por Mês" />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pagarData} margin={{ left: -20, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={v => truncate(v, 12)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [v, "Respostas"]} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {pagarData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Qualidade Internet */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <SectionTitle title="Qualidade da Internet" />
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={stats.qualidadeInternet.map(d => ({ name: d.qualidade_internet, value: parseInt(d.count) }))}
                    cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, percent }) => `${truncate(name, 12)} ${Math.round(percent * 100)}%`}
                    labelLine={false} fontSize={11}
                  >
                    {stats.qualidadeInternet.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [v, "Respostas"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Prioridades Radar + Timeline */}
        {stats && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Importância das Funcionalidades */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <SectionTitle title="Importância das Funcionalidades (Média 1-5)" />
              {prioridadesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={prioridadesData} cx="50%" cy="50%" outerRadius={100}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
                    <Radar name="Média" dataKey="value" stroke="#2e7d5e" fill="#2e7d5e" fillOpacity={0.35} />
                    <Tooltip formatter={(v) => [Number(v).toFixed(1), "Média"]} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Sem dados suficientes.</div>
              )}
            </div>

            {/* Timeline */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <SectionTitle title="Entrevistas ao Longo do Tempo" />
              {timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={timelineData} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [v, "Entrevistas"]} />
                    <Line type="monotone" dataKey="count" stroke="#2e7d5e" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Nenhuma entrevista registada ainda.</div>
              )}
            </div>
          </section>
        )}

        {/* Surveys Table */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="font-semibold text-lg">Entrevistas Realizadas</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  className="pl-9 h-9 rounded-lg border border-input bg-background text-sm px-3 w-full sm:w-44 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                  placeholder="Entrevistador..."
                  value={filterEntrevistador}
                  onChange={e => { setFilterEntrevistador(e.target.value); setPage(1); }}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  className="pl-9 h-9 rounded-lg border border-input bg-background text-sm px-3 w-full sm:w-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                  placeholder="Bairro..."
                  value={filterBairro}
                  onChange={e => { setFilterBairro(e.target.value); setPage(1); }}
                />
              </div>
              <button
                onClick={downloadCSV}
                className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg border border-input bg-background text-sm hover:bg-muted transition-all"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">A carregar...</div>
            ) : surveys.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>Nenhuma entrevista encontrada.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Entrevistador</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Bairro</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Disposição</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Acções</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveys.map((s, idx) => (
                      <tr key={s.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? "" : "bg-muted/10"}`}>
                        <td className="py-3 px-4 font-medium">{s.entrevistador}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                          {s.data_entrevista ? new Date(s.data_entrevista).toLocaleDateString("pt-MZ") : "—"}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">{s.bairro_zona}</td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${s.disposicao_uso === "Com certeza que sim" ? "bg-primary/10 text-primary" :
                              s.disposicao_uso === "Talvez, dependendo do preço" ? "bg-accent/10 text-accent-foreground" :
                              "bg-muted text-muted-foreground"}`}>
                            {s.disposicao_uso || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => viewSurvey(s.id)}
                              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button onClick={() => deleteSurvey(s.id)}
                              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} de {total} entrevistas
              </p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-lg border hover:bg-muted disabled:opacity-40 transition-all">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-lg border hover:bg-muted disabled:opacity-40 transition-all">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Survey Detail Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-xl border shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-card z-10">
              <h3 className="font-semibold text-lg">Detalhe da Entrevista</h3>
              <button onClick={() => setSelectedSurvey(null)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              {Object.entries(selectedSurvey).map(([key, val]) => {
                if (key === "id") return null;
                const formatted = typeof val === "object" && val !== null
                  ? Array.isArray(val) ? (val as string[]).join(", ") : JSON.stringify(val, null, 2)
                  : String(val || "—");
                const label = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                return (
                  <div key={key} className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
                    <span className="bg-muted/50 rounded-md px-3 py-2 break-words">{formatted}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
