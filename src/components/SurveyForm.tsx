"use client";

import { useState } from "react";
import {
  ClipboardList, User, Calendar, Clock, MapPin, Phone,
  Store, BarChart2, AlertTriangle, Smartphone, Wifi, MessageSquare,
  Send, CheckCircle2, ChevronDown, ChevronUp,
} from "lucide-react";

type CheckboxOption = { label: string; value: string };
type RadioOption = { label: string; value: string };

function SectionHeader({ letter, icon: Icon, title }: {
  letter?: string;
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex flex-col space-y-1.5 p-6 pb-4">
      <h3 className="font-semibold tracking-tight flex items-center gap-3 text-lg">
        {letter && (
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold font-mono">
            {letter}
          </span>
        )}
        <span className="text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <span style={{ fontFamily: "var(--font-display, var(--font-sans))" }}>{title}</span>
      </h3>
    </div>
  );
}

function CustomCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer
        ${checked ? "bg-primary border-primary" : "border-input"}`}
    >
      {checked && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
          className="w-3 h-3 text-white">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  );
}

function CustomRadio({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer
        ${checked ? "border-primary" : "border-input"}`}
    >
      {checked && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
    </div>
  );
}

function CheckboxGroup({
  options, values, onChange, otherValue, onOtherChange, otherPlaceholder = "Outro (especifique)"
}: {
  options: CheckboxOption[];
  values: string[];
  onChange: (val: string) => void;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
  otherPlaceholder?: string;
}) {
  return (
    <div className="space-y-2">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
          <CustomCheckbox
            checked={values.includes(opt.value)}
            onChange={() => onChange(opt.value)}
          />
          <span className="text-sm">{opt.label}</span>
        </label>
      ))}
      {onOtherChange !== undefined && (
        <div className="mt-2">
          <input
            className="flex w-full rounded-lg border border-input bg-background text-sm h-10 px-3 py-2 hover:border-ring/50 focus-visible:outline-none focus-visible:border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
            placeholder={otherPlaceholder}
            value={otherValue || ""}
            onChange={e => onOtherChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

function RadioGroup({
  options, value, onChange, otherValue, onOtherChange
}: {
  options: RadioOption[];
  value: string;
  onChange: (val: string) => void;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
          <CustomRadio
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <span className="text-sm">{opt.label}</span>
        </label>
      ))}
      {onOtherChange !== undefined && (
        <input
          className="flex w-full rounded-lg border border-input bg-background text-sm h-10 px-3 py-2 mt-2 hover:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
          placeholder="Outro (especifique)"
          value={otherValue || ""}
          onChange={e => onOtherChange(e.target.value)}
        />
      )}
    </div>
  );
}

function RatingRow({ label, value, onChange }: {
  label: string; value: number; onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <span className="text-sm flex-1 min-w-0">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-9 h-9 rounded-md text-sm font-medium transition-all
              ${value === n
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuestionLabel({ num, text, hint }: { num: number; text: string; hint?: string }) {
  return (
    <div>
      <p className="text-sm font-medium">
        <span className="font-mono text-primary mr-2">{num}.</span>{text}
      </p>
      {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}

function InputWithIcon({ icon: Icon, id, placeholder, value, onChange, type = "text", required }: {
  icon: React.ElementType;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        id={id}
        type={type}
        className="flex w-full rounded-lg border border-input bg-background text-sm h-10 px-3 py-2 pl-10 hover:border-ring/50 focus-visible:outline-none focus-visible:border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}

// ======= Main Survey Form =======

const tipoOptions: CheckboxOption[] = [
  { label: "Loja / Mini-mercado", value: "Loja / Mini-mercado" },
  { label: "Restaurante / Cantina", value: "Restaurante / Cantina" },
  { label: "Supermercado", value: "Supermercado" },
  { label: "Grossista", value: "Grossista" },
  { label: "Bottle Store / Bebidas", value: "Bottle Store / Bebidas" },
  { label: "Serviços / Subscrições", value: "Serviços / Subscrições" },
  { label: "Farmácia", value: "Farmácia" },
];
const tempoOptions: RadioOption[] = [
  { label: "Menos de 1 ano", value: "Menos de 1 ano" },
  { label: "1 a 3 anos", value: "1 a 3 anos" },
  { label: "3 a 5 anos", value: "3 a 5 anos" },
  { label: "Mais de 5 anos", value: "Mais de 5 anos" },
];
const funcOptions: RadioOption[] = [
  { label: "Só eu (1 pessoa)", value: "Só eu (1 pessoa)" },
  { label: "2 a 3 pessoas", value: "2 a 3 pessoas" },
  { label: "4 a 6 pessoas", value: "4 a 6 pessoas" },
  { label: "Mais de 6", value: "Mais de 6" },
];
const electricidadeOptions: RadioOption[] = [
  { label: "Electricidade estável", value: "Electricidade estável" },
  { label: "Electricidade instável (cortes frequentes)", value: "Electricidade instável (cortes frequentes)" },
  { label: "Sem electricidade", value: "Sem electricidade" },
];
const dispositivosOptions: CheckboxOption[] = [
  { label: "Sim, smartphone", value: "Sim, smartphone" },
  { label: "Sim, tablet", value: "Sim, tablet" },
  { label: "Sim, computador", value: "Sim, computador" },
  { label: "Não possuo nenhum", value: "Não possuo nenhum" },
];
const vendaOptions: CheckboxOption[] = [
  { label: "Caderno / bloco de notas manual", value: "Caderno / bloco de notas manual" },
  { label: "Folha de cálculo (Excel, Sheets)", value: "Folha de cálculo (Excel, Sheets)" },
  { label: "Aplicação/software", value: "Aplicação/software" },
  { label: "Não controlo / faço de cabeça", value: "Não controlo / faço de cabeça" },
];
const stockOptions: RadioOption[] = [
  { label: "Caderno manual", value: "Caderno manual" },
  { label: "Excel / Sheets", value: "Excel / Sheets" },
  { label: "Software/app", value: "Software/app" },
  { label: "Não controlo", value: "Não controlo" },
];
const rupturaOptions: RadioOption[] = [
  { label: "Todos os dias", value: "Todos os dias" },
  { label: "Algumas vezes por semana", value: "Algumas vezes por semana" },
  { label: "Raramente", value: "Raramente" },
  { label: "Nunca acontece", value: "Nunca acontece" },
];
const perdaOptions: RadioOption[] = [
  { label: "Sim, frequentemente", value: "Sim, frequentemente" },
  { label: "Sim, às vezes", value: "Sim, às vezes" },
  { label: "Raramente", value: "Raramente" },
  { label: "Nunca", value: "Nunca" },
];
const caixaOptions: CheckboxOption[] = [
  { label: "Conto o dinheiro fisicamente", value: "Conto o dinheiro fisicamente" },
  { label: "Somo as anotações do caderno", value: "Somo as anotações do caderno" },
  { label: "O sistema/app faz o cálculo automático", value: "O sistema/app faz o cálculo automático" },
  { label: "Não tenho esse controlo", value: "Não tenho esse controlo" },
];
const problemaOptions: CheckboxOption[] = [
  { label: "Não saber o que tem em stock", value: "Não saber o que tem em stock" },
  { label: "Perder dinheiro sem saber porquê", value: "Perder dinheiro sem saber porquê" },
  { label: "Funcionários a desviar produtos/dinheiro", value: "Funcionários a desviar produtos/dinheiro" },
  { label: "Não saber quais produtos vendem mais", value: "Não saber quais produtos vendem mais" },
  { label: "Dificuldade em controlar fiados/créditos", value: "Dificuldade em controlar fiados/créditos" },
  { label: "Falta de tempo para gerir tudo", value: "Falta de tempo para gerir tudo" },
];
const desvioOptions: RadioOption[] = [
  { label: "Não, nunca", value: "Não, nunca" },
  { label: "Suspeito, mas não tenho provas", value: "Suspeito, mas não tenho provas" },
  { label: "Sim, já aconteceu", value: "Sim, já aconteceu" },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];
const softwareAnteriorOptions: RadioOption[] = [
  { label: "Sim", value: "Sim" },
  { label: "Não, nunca usei", value: "Não, nunca usei" },
  { label: "Tentei mas era muito complicado", value: "Tentei mas era muito complicado" },
  { label: "Tentei mas era muito caro", value: "Tentei mas era muito caro" },
];
const disposicaoOptions: RadioOption[] = [
  { label: "Com certeza que sim", value: "Com certeza que sim" },
  { label: "Talvez, dependendo do preço", value: "Talvez, dependendo do preço" },
  { label: "Provavelmente não", value: "Provavelmente não" },
  { label: "Não", value: "Não" },
];
const pagarOptions: RadioOption[] = [
  { label: "Nada (apenas gratuito)", value: "Nada (apenas gratuito)" },
  { label: "Até 200 MT / mês", value: "Até 200 MT / mês" },
  { label: "200 a 500 MT / mês", value: "200 a 500 MT / mês" },
  { label: "500 a 1.000 MT / mês", value: "500 a 1.000 MT / mês" },
  { label: "Mais de 1.000 MT / mês, se valer a pena", value: "Mais de 1.000 MT / mês, se valer a pena" },
];
const formaPagamentoOptions: RadioOption[] = [
  { label: "Mensalidade (assinatura mensal)", value: "Mensalidade (assinatura mensal)" },
  { label: "Pagamento único (compra definitiva)", value: "Pagamento único (compra definitiva)" },
  { label: "Grátis com funções limitadas + pago para mais", value: "Grátis com funções limitadas + pago para mais" },
  { label: "Não sei / tanto faz", value: "Não sei / tanto faz" },
];
const operadorOptions: RadioOption[] = [
  { label: "Vodacom", value: "Vodacom" },
  { label: "Movitel", value: "Movitel" },
  { label: "Tmcel", value: "Tmcel" },
  { label: "Não uso internet móvel", value: "Não uso internet móvel" },
];
const internetOptions: RadioOption[] = [
  { label: "Boa (rápida e estável)", value: "Boa (rápida e estável)" },
  { label: "Razoável (às vezes cai)", value: "Razoável (às vezes cai)" },
  { label: "Fraca / instável", value: "Fraca / instável" },
  { label: "Não tenho", value: "Não tenho" },
];
const scannerOptions: RadioOption[] = [
  { label: "Sim", value: "Sim" },
  { label: "Não, mas gostaria", value: "Não, mas gostaria" },
  { label: "Não, e não preciso", value: "Não, e não preciso" },
];
const prioridadesLabels = [
  "Controlo de stock em tempo real",
  "Registo de vendas rápido",
  "Relatórios e resumos do negócio",
  "Controlo de caixa / dinheiro",
  "Alertas de produto em falta",
  "Controlo de fiados / créditos",
  "Funcionar sem internet",
];

type FormState = {
  entrevistador: string;
  dataEntrevista: string;
  horaEntrevista: string;
  bairroZona: string;
  numeroFormulario: string;
  contacto: string;
  tipoEstabelecimento: string[];
  tipoEstabelecimentoOutro: string;
  tempoAberto: string;
  numFuncionarios: string;
  electricidade: string;
  dispositivos: string[];
  controloVendas: string[];
  controloVendasQual: string;
  controloVendasOutro: string;
  controloStock: string;
  controloStockOutro: string;
  frequenciaRuptura: string;
  perdaVendas: string;
  fechoCaixa: string[];
  maiorProblema: string[];
  maiorProblemaOutro: string;
  desvioFuncionarios: string;
  softwareAnterior: string;
  softwareAnteriorQual: string;
  softwareAnteriorMotivo: string;
  disposicaoUso: string;
  disposicaoPagar: string;
  formaPagamento: string;
  prioridades: Record<string, number>;
  operadorMovel: string;
  operadorMovelOutro: string;
  qualidadeInternet: string;
  leitorCodigoBarras: string;
  oQueNuncaDeveTer: string;
  mudarModoGestao: string;
  sugestoesComentarios: string;
};

const initialState: FormState = {
  entrevistador: "", dataEntrevista: "", horaEntrevista: "", bairroZona: "",
  numeroFormulario: "", contacto: "",
  tipoEstabelecimento: [], tipoEstabelecimentoOutro: "",
  tempoAberto: "", numFuncionarios: "", electricidade: "", dispositivos: [],
  controloVendas: [], controloVendasQual: "", controloVendasOutro: "",
  controloStock: "", controloStockOutro: "", frequenciaRuptura: "", perdaVendas: "",
  fechoCaixa: [], maiorProblema: [], maiorProblemaOutro: "",
  desvioFuncionarios: "", softwareAnterior: "", softwareAnteriorQual: "", softwareAnteriorMotivo: "",
  disposicaoUso: "", disposicaoPagar: "", formaPagamento: "", prioridades: {},
  operadorMovel: "", operadorMovelOutro: "", qualidadeInternet: "", leitorCodigoBarras: "",
  oQueNuncaDeveTer: "", mudarModoGestao: "", sugestoesComentarios: "",
};

function toggleArray(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

export default function SurveyForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function toggleCheck(key: keyof FormState, val: string) {
    setForm(f => ({ ...f, [key]: toggleArray(f[key] as string[], val) }));
  }

  function setPriority(label: string, val: number) {
    setForm(f => ({ ...f, prioridades: { ...f.prioridades, [label]: val } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entrevistador: form.entrevistador,
          dataEntrevista: form.dataEntrevista,
          horaEntrevista: form.horaEntrevista,
          bairroZona: form.bairroZona,
          numeroFormulario: form.numeroFormulario,
          contacto: form.contacto,
          tipoEstabelecimento: form.tipoEstabelecimento,
          tipoEstabelecimentoOutro: form.tipoEstabelecimentoOutro,
          tempoAberto: form.tempoAberto,
          numFuncionarios: form.numFuncionarios,
          electricidade: form.electricidade,
          dispositivos: form.dispositivos,
          controloVendas: form.controloVendas,
          controloVendasQual: form.controloVendasQual,
          controloVendasOutro: form.controloVendasOutro,
          controloStock: form.controloStock,
          controloStockOutro: form.controloStockOutro,
          frequenciaRuptura: form.frequenciaRuptura,
          perdaVendas: form.perdaVendas,
          fechoCaixa: form.fechoCaixa,
          maiorProblema: form.maiorProblema,
          maiorProblemaOutro: form.maiorProblemaOutro,
          desvioFuncionarios: form.desvioFuncionarios,
          softwareAnterior: form.softwareAnterior,
          softwareAnteriorQual: form.softwareAnteriorQual,
          softwareAnteriorMotivo: form.softwareAnteriorMotivo,
          disposicaoUso: form.disposicaoUso,
          disposicaoPagar: form.disposicaoPagar,
          formaPagamento: form.formaPagamento,
          prioridades: form.prioridades,
          operadorMovel: form.operadorMovel,
          operadorMovelOutro: form.operadorMovelOutro,
          qualidadeInternet: form.qualidadeInternet,
          leitorCodigoBarras: form.leitorCodigoBarras,
          oQueNuncaDeveTer: form.oQueNuncaDeveTer,
          mudarModoGestao: form.mudarModoGestao,
          sugestoesComentarios: form.sugestoesComentarios,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao submeter entrevista.");
      }

      setSubmitted(true);
      setForm(initialState);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-2xl tracking-tight" style={{ fontFamily: "var(--font-display, var(--font-sans))" }}>
              Entrevista Submetida!
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Obrigado pela sua participação. As respostas foram guardadas com sucesso.
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-lg px-6 text-sm font-medium transition-all gap-2"
          >
            Nova Entrevista
          </button>
        </div>
      </div>
    );
  }

  const card = "rounded-lg border bg-card text-card-foreground shadow-sm";
  const textarea = "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm hover:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl" style={{ fontFamily: "var(--font-display, var(--font-sans))" }}>S</span>
            </div>
            <div>
              <h1 className="font-bold text-2xl md:text-3xl tracking-tight" style={{ fontFamily: "var(--font-display, var(--font-sans))" }}>
                STOKA
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Validação de Mercado</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-2">Formulário de Entrevista — Projecto STOKA</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Dados da Entrevista */}
          <div className={card}>
            <SectionHeader icon={ClipboardList} title="Dados da Entrevista" />
            <div className="p-6 pt-0 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium leading-none" htmlFor="entrevistador">Entrevistador *</label>
                  <InputWithIcon icon={User} id="entrevistador" placeholder="Nome do entrevistador"
                    value={form.entrevistador} onChange={v => setField("entrevistador", v)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="dataEntrevista">Data *</label>
                  <InputWithIcon icon={Calendar} id="dataEntrevista" type="date"
                    value={form.dataEntrevista} onChange={v => setField("dataEntrevista", v)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="horaEntrevista">Hora</label>
                  <InputWithIcon icon={Clock} id="horaEntrevista" type="time"
                    value={form.horaEntrevista} onChange={v => setField("horaEntrevista", v)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="bairroZona">Bairro / Zona *</label>
                  <InputWithIcon icon={MapPin} id="bairroZona" placeholder="Ex: Matola, Maputo"
                    value={form.bairroZona} onChange={v => setField("bairroZona", v)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="contacto">Contacto</label>
                  <InputWithIcon icon={Phone} id="contacto" placeholder="Telefone/email"
                    value={form.contacto} onChange={v => setField("contacto", v)} />
                </div>
              </div>
            </div>
          </div>

          {/* Secção A */}
          <div className={card}>
            <SectionHeader letter="A" icon={Store} title="Secção A — Perfil do Estabelecimento" />
            <div className="p-6 pt-0 space-y-6">
              <div className="space-y-3">
                <QuestionLabel num={1} text="Tipo de estabelecimento" hint="(seleccione todos os que se aplicam)" />
                <CheckboxGroup options={tipoOptions} values={form.tipoEstabelecimento}
                  onChange={v => toggleCheck("tipoEstabelecimento", v)}
                  otherValue={form.tipoEstabelecimentoOutro}
                  onOtherChange={v => setField("tipoEstabelecimentoOutro", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={2} text="Há quanto tempo o estabelecimento está aberto?" />
                <RadioGroup options={tempoOptions} value={form.tempoAberto} onChange={v => setField("tempoAberto", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={3} text="Quantos funcionários trabalham aqui (incluindo o dono)?" />
                <RadioGroup options={funcOptions} value={form.numFuncionarios} onChange={v => setField("numFuncionarios", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={4} text="O estabelecimento possui:" />
                <RadioGroup options={electricidadeOptions} value={form.electricidade} onChange={v => setField("electricidade", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={5} text="Possui smartphone ou tablet no estabelecimento?" hint="(seleccione todos os que se aplicam)" />
                <CheckboxGroup options={dispositivosOptions} values={form.dispositivos}
                  onChange={v => toggleCheck("dispositivos", v)} />
              </div>
            </div>
          </div>

          {/* Secção B */}
          <div className={card}>
            <SectionHeader letter="B" icon={BarChart2} title="Secção B — Controlo Actual de Vendas e Stock" />
            <div className="p-6 pt-0 space-y-6">
              <div className="space-y-3">
                <QuestionLabel num={6} text="Como controla actualmente as suas vendas?" hint="(seleccione todos os que se aplicam)" />
                <CheckboxGroup options={vendaOptions} values={form.controloVendas}
                  onChange={v => toggleCheck("controloVendas", v)}
                  otherValue={form.controloVendasOutro}
                  onOtherChange={v => setField("controloVendasOutro", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={7} text="Como controla o seu stock/inventário?" />
                <RadioGroup options={stockOptions} value={form.controloStock}
                  onChange={v => setField("controloStock", v)}
                  otherValue={form.controloStockOutro}
                  onOtherChange={v => setField("controloStockOutro", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={8} text="Com que frequência percebe que um produto acabou sem ter previsto?" />
                <RadioGroup options={rupturaOptions} value={form.frequenciaRuptura}
                  onChange={v => setField("frequenciaRuptura", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={9} text="Já perdeu vendas porque um produto estava em falta sem saber?" />
                <RadioGroup options={perdaOptions} value={form.perdaVendas}
                  onChange={v => setField("perdaVendas", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={10} text="Como sabe quanto dinheiro entrou no caixa no final do dia?" hint="(seleccione todos os que se aplicam)" />
                <CheckboxGroup options={caixaOptions} values={form.fechoCaixa}
                  onChange={v => toggleCheck("fechoCaixa", v)} />
              </div>
            </div>
          </div>

          {/* Secção C */}
          <div className={card}>
            <SectionHeader letter="C" icon={AlertTriangle} title="Secção C — Problemas e Dor do Negócio" />
            <div className="p-6 pt-0 space-y-6">
              <div className="space-y-3">
                <QuestionLabel num={11} text="Qual é o maior problema no dia-a-dia do seu negócio?" hint="(máximo 2 opções)" />
                <CheckboxGroup options={problemaOptions} values={form.maiorProblema}
                  onChange={v => {
                    if (form.maiorProblema.includes(v)) {
                      setField("maiorProblema", form.maiorProblema.filter(x => x !== v));
                    } else if (form.maiorProblema.length < 2) {
                      setField("maiorProblema", [...form.maiorProblema, v]);
                    }
                  }}
                  otherValue={form.maiorProblemaOutro}
                  onOtherChange={v => setField("maiorProblemaOutro", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={12} text="Já teve problemas com funcionários a desviar stock ou dinheiro?" />
                <RadioGroup options={desvioOptions} value={form.desvioFuncionarios}
                  onChange={v => setField("desvioFuncionarios", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={13} text="Já usou algum software de gestão comercial antes?" />
                <RadioGroup options={softwareAnteriorOptions} value={form.softwareAnterior}
                  onChange={v => setField("softwareAnterior", v)} />
              </div>
            </div>
          </div>

          {/* Secção D */}
          <div className={card}>
            <SectionHeader letter="D" icon={Smartphone} title="Secção D — Disposição para Adoptar um Sistema" />
            <div className="p-6 pt-0 space-y-6">
              <div className="space-y-3">
                <QuestionLabel num={14} text="Se existisse uma aplicação simples para controlar stock e vendas no seu telemóvel, usaria?" />
                <RadioGroup options={disposicaoOptions} value={form.disposicaoUso}
                  onChange={v => setField("disposicaoUso", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={15} text="Quanto estaria disposto a pagar por mês por uma aplicação desse tipo?" />
                <RadioGroup options={pagarOptions} value={form.disposicaoPagar}
                  onChange={v => setField("disposicaoPagar", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={16} text="Preferiria pagar como?" />
                <RadioGroup options={formaPagamentoOptions} value={form.formaPagamento}
                  onChange={v => setField("formaPagamento", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={17} text="O que é mais importante para si numa aplicação de gestão?" hint="(classifique de 1 a 5, sendo 5 o mais importante)" />
                <div className="space-y-3">
                  {prioridadesLabels.map(label => (
                    <RatingRow key={label} label={label}
                      value={form.prioridades[label] || 0}
                      onChange={n => setPriority(label, n)} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Secção E */}
          <div className={card}>
            <SectionHeader letter="E" icon={Wifi} title="Secção E — Infraestrutura Tecnológica" />
            <div className="p-6 pt-0 space-y-6">
              <div className="space-y-3">
                <QuestionLabel num={18} text="Qual é o operador de internet móvel que usa?" />
                <RadioGroup options={operadorOptions} value={form.operadorMovel}
                  onChange={v => setField("operadorMovel", v)}
                  otherValue={form.operadorMovelOutro}
                  onOtherChange={v => setField("operadorMovelOutro", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={19} text="A internet no seu estabelecimento é:" />
                <RadioGroup options={internetOptions} value={form.qualidadeInternet}
                  onChange={v => setField("qualidadeInternet", v)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={20} text="Possui leitor de código de barras (scanner)?" />
                <RadioGroup options={scannerOptions} value={form.leitorCodigoBarras}
                  onChange={v => setField("leitorCodigoBarras", v)} />
              </div>
            </div>
          </div>

          {/* Secção F */}
          <div className={card}>
            <SectionHeader letter="F" icon={MessageSquare} title="Secção F — Perguntas Abertas" />
            <div className="p-6 pt-0 space-y-6">
              <p className="text-xs text-muted-foreground italic -mt-2">Entrevistador preenche com base nas respostas do entrevistado</p>
              <div className="space-y-3">
                <QuestionLabel num={21} text="Na sua opinião, o que é que uma boa aplicação de gestão NUNCA deve fazer ou ter?" />
                <textarea className={textarea} placeholder="Resposta do entrevistado..." rows={3}
                  value={form.oQueNuncaDeveTer} onChange={e => setField("oQueNuncaDeveTer", e.target.value)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={22} text="Se pudesse mudar uma coisa no modo como gere o seu negócio hoje, o que seria?" />
                <textarea className={textarea} placeholder="Resposta do entrevistado..." rows={3}
                  value={form.mudarModoGestao} onChange={e => setField("mudarModoGestao", e.target.value)} />
              </div>
              <div className="space-y-3">
                <QuestionLabel num={23} text="Tem alguma sugestão ou comentário adicional?" />
                <textarea className={textarea} placeholder="Resposta do entrevistado..." rows={3}
                  value={form.sugestoesComentarios} onChange={e => setField("sugestoesComentarios", e.target.value)} />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="sticky bottom-4 z-10">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md h-11 rounded-lg px-6 text-base w-full gap-2 shadow-lg"
            >
              {submitting ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitting ? "A submeter..." : "Submeter Entrevista"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
