import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      entrevistador, dataEntrevista, horaEntrevista, bairroZona,
      numeroFormulario, contacto,
      tipoEstabelecimento, tipoEstabelecimentoOutro,
      tempoAberto, numFuncionarios, electricidade, dispositivos,
      controloVendas, controloVendasQual, controloVendasOutro,
      controloStock, controloStockOutro,
      frequenciaRuptura, perdaVendas, fechoCaixa,
      maiorProblema, maiorProblemaOutro,
      desvioFuncionarios, softwareAnterior, softwareAnteriorQual, softwareAnteriorMotivo,
      disposicaoUso, disposicaoPagar, formaPagamento, prioridades,
      operadorMovel, operadorMovelOutro, qualidadeInternet, leitorCodigoBarras,
      oQueNuncaDeveTer, mudarModoGestao, sugestoesComentarios,
    } = body;

    if (!entrevistador || !dataEntrevista || !bairroZona) {
      return NextResponse.json(
        { error: "Entrevistador, data e bairro são obrigatórios." },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO surveys (
        entrevistador, data_entrevista, hora_entrevista, bairro_zona,
        numero_formulario, contacto,
        tipo_estabelecimento, tipo_estabelecimento_outro,
        tempo_aberto, num_funcionarios, electricidade, dispositivos,
        controlo_vendas, controlo_vendas_qual, controlo_vendas_outro,
        controlo_stock, controlo_stock_outro,
        frequencia_ruptura, perda_vendas, fecho_caixa,
        maior_problema, maior_problema_outro,
        desvio_funcionarios, software_anterior, software_anterior_qual, software_anterior_motivo,
        disposicao_uso, disposicao_pagar, forma_pagamento, prioridades,
        operador_movel, operador_movel_outro, qualidade_internet, leitor_codigo_barras,
        o_que_nunca_deve_ter, mudar_modo_gestao, sugestoes_comentarios
      ) VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,
        $27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37
      ) RETURNING id`,
      [
        entrevistador, dataEntrevista, horaEntrevista || null, bairroZona,
        numeroFormulario || null, contacto || null,
        JSON.stringify(tipoEstabelecimento || []), tipoEstabelecimentoOutro || null,
        tempoAberto || null, numFuncionarios || null, electricidade || null,
        JSON.stringify(dispositivos || []),
        JSON.stringify(controloVendas || []), controloVendasQual || null, controloVendasOutro || null,
        controloStock || null, controloStockOutro || null,
        frequenciaRuptura || null, perdaVendas || null, JSON.stringify(fechoCaixa || []),
        JSON.stringify(maiorProblema || []), maiorProblemaOutro || null,
        desvioFuncionarios || null, softwareAnterior || null,
        softwareAnteriorQual || null, softwareAnteriorMotivo || null,
        disposicaoUso || null, disposicaoPagar || null, formaPagamento || null,
        JSON.stringify(prioridades || {}),
        operadorMovel || null, operadorMovelOutro || null, qualidadeInternet || null,
        leitorCodigoBarras || null,
        oQueNuncaDeveTer || null, mudarModoGestao || null, sugestoesComentarios || null,
      ]
    );

    return NextResponse.json({ success: true, id: result.rows[0].id }, { status: 201 });
  } catch (err) {
    console.error("Survey POST error:", err);
    return NextResponse.json({ error: "Erro ao guardar entrevista." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const entrevistador = searchParams.get("entrevistador") || "";
  const bairro = searchParams.get("bairro") || "";
  const offset = (page - 1) * limit;

  let whereClause = "WHERE 1=1";
  const params: any[] = [];
  let idx = 1;

  if (entrevistador) {
    whereClause += ` AND LOWER(entrevistador) LIKE LOWER($${idx++})`;
    params.push(`%${entrevistador}%`);
  }
  if (bairro) {
    whereClause += ` AND LOWER(bairro_zona) LIKE LOWER($${idx++})`;
    params.push(`%${bairro}%`);
  }

  const countRes = await query(`SELECT COUNT(*) FROM surveys ${whereClause}`, params);
  const total = parseInt(countRes.rows[0].count);

  params.push(limit, offset);
  const dataRes = await query(
    `SELECT id, entrevistador, data_entrevista, hora_entrevista, bairro_zona, numero_formulario,
            tipo_estabelecimento, tempo_aberto, num_funcionarios, disposicao_uso, disposicao_pagar,
            created_at
     FROM surveys ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    params
  );

  return NextResponse.json({ surveys: dataRes.rows, total, page, limit });
}
