import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    // Total entrevistas
    const totalRes = await query("SELECT COUNT(*) as count FROM surveys");
    const total = parseInt(totalRes.rows[0].count);

    // Bairros únicos
    const bairrosRes = await query("SELECT COUNT(DISTINCT bairro_zona) as count FROM surveys");
    const bairros = parseInt(bairrosRes.rows[0].count);

    // Disposição de uso
    const disposicaoRes = await query(
      `SELECT disposicao_uso, COUNT(*) as count FROM surveys WHERE disposicao_uso IS NOT NULL GROUP BY disposicao_uso ORDER BY count DESC`
    );

    // Disposição de pagar
    const pagarRes = await query(
      `SELECT disposicao_pagar, COUNT(*) as count FROM surveys WHERE disposicao_pagar IS NOT NULL GROUP BY disposicao_pagar ORDER BY count DESC`
    );

    // Tipo de estabelecimento (via JSONB)
    const allSurveysRes = await query(
      `SELECT tipo_estabelecimento, maior_problema, controlo_vendas, dispositivos, fecho_caixa, prioridades, operador_movel, qualidade_internet, electricidade FROM surveys`
    );

    // Aggregate from JSONB arrays
    const tipoCount: Record<string, number> = {};
    const problemaCount: Record<string, number> = {};
    const vendaCount: Record<string, number> = {};
    const prioridades: Record<string, { sum: number; count: number }> = {};

    for (const row of allSurveysRes.rows) {
      for (const t of row.tipo_estabelecimento || []) {
        tipoCount[t] = (tipoCount[t] || 0) + 1;
      }
      for (const p of row.maior_problema || []) {
        problemaCount[p] = (problemaCount[p] || 0) + 1;
      }
      for (const v of row.controlo_vendas || []) {
        vendaCount[v] = (vendaCount[v] || 0) + 1;
      }
      if (row.prioridades && typeof row.prioridades === "object") {
        for (const [key, val] of Object.entries(row.prioridades)) {
          if (!prioridades[key]) prioridades[key] = { sum: 0, count: 0 };
          prioridades[key].sum += Number(val);
          prioridades[key].count += 1;
        }
      }
    }

    // Prioridades médias
    const prioridadesMedia: Record<string, number> = {};
    for (const [k, v] of Object.entries(prioridades)) {
      prioridadesMedia[k] = v.count > 0 ? Math.round((v.sum / v.count) * 10) / 10 : 0;
    }

    // Entrevistas por dia (últimas 30 ocorrências)
    const timelineRes = await query(
      `SELECT DATE(data_entrevista) as dia, COUNT(*) as count
       FROM surveys
       GROUP BY dia
       ORDER BY dia DESC
       LIMIT 30`
    );

    // Operadores
    const operadorRes = await query(
      `SELECT operador_movel, COUNT(*) as count FROM surveys WHERE operador_movel IS NOT NULL GROUP BY operador_movel ORDER BY count DESC`
    );

    // Qualidade internet
    const internetRes = await query(
      `SELECT qualidade_internet, COUNT(*) as count FROM surveys WHERE qualidade_internet IS NOT NULL GROUP BY qualidade_internet ORDER BY count DESC`
    );

    // Electricidade
    const electricidadeRes = await query(
      `SELECT electricidade, COUNT(*) as count FROM surveys WHERE electricidade IS NOT NULL GROUP BY electricidade ORDER BY count DESC`
    );

    return NextResponse.json({
      total,
      bairros,
      disposicaoUso: disposicaoRes.rows,
      disposicaoPagar: pagarRes.rows,
      tipoEstabelecimento: Object.entries(tipoCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      maiorProblema: Object.entries(problemaCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      controloVendas: Object.entries(vendaCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      prioridades: prioridadesMedia,
      timeline: timelineRes.rows.reverse(),
      operadores: operadorRes.rows,
      qualidadeInternet: internetRes.rows,
      electricidade: electricidadeRes.rows,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Erro ao obter estatísticas." }, { status: 500 });
  }
}
