/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, MapPin, Clock, ListChecks, FileText, History, Phone, Plus, Trash2, Play, Loader2, Copy, Check, ChevronDown, Info, User } from 'lucide-react';

const AREAS: Record<string, { label: string; phone: string }> = {
  '1': { label: 'Área I',   phone: '62 9 9641-4977' },
  '2': { label: 'Área II',  phone: '62 9 9681-7279' },
  '3': { label: 'Área III', phone: '62 9 9968-6674' },
  '4': { label: 'Área IV',  phone: '62 9 9660-6902' },
  '5': { label: 'Área V',   phone: '62 9 9969-7361' }
};

const LOCAIS_GRUPOS = [
  { grupo: 'Terminais', itens: [
    { id: 'term-vera-cruz',    label: 'Terminal Vera Cruz',       bairro: 'Goiânia',                   cep: '74675-060' },
    { id: 'term-pe-pelagio',   label: 'Terminal Padre Pelágio',   bairro: 'Bairro Ipiranga',            cep: '74423-020' },
    { id: 'term-dergo',        label: 'Terminal Dergo',           bairro: 'Setor Rodoviário',           cep: '74073-010' },
    { id: 'term-praca-a',      label: 'Terminal Praça A',         bairro: 'Setor Campinas',             cep: '74503-010' },
    { id: 'term-praca-biblia', label: 'Terminal Praça da Bíblia', bairro: 'Setor Leste Universitário', cep: '74605-010' },
    { id: 'term-novo-mundo',   label: 'Terminal Novo Mundo',      bairro: 'Jardim Novo Mundo',          cep: '74707-060' },
    { id: 'term-goianira',     label: 'Terminal Goianira',        bairro: 'Goianira',                  cep: '75390-000' },
    { id: 'term-sen-canedo',   label: 'Terminal Senador Canedo',  bairro: 'Senador Canedo',             cep: '75250-000' },
    { id: 'term-trindade',     label: 'Terminal Trindade',        bairro: 'Trindade',                  cep: '75380-000' },
  ]},
  { grupo: 'Estações', itens: [
    { id: 'est-iquego',        label: 'Estação Iquego',           bairro: 'Bairro Ipiranga',            cep: '74423-010' },
    { id: 'est-capuava',       label: 'Estação Capuava',          bairro: 'Bairro Ipiranga',            cep: '74423-050' },
    { id: 'est-anicuns',       label: 'Estação Anicuns',          bairro: 'Setor Esplanada do Anicuns', cep: '74690-250' },
    { id: 'est-cascavel',      label: 'Estação Cascavel',         bairro: 'Setor Rodoviário',           cep: '74073-020' },
    { id: 'est-jose-hermano',  label: 'Estação José Hermano',     bairro: 'Setor Campinas',             cep: '74503-020' },
    { id: 'est-campinas',      label: 'Estação Campinas',         bairro: 'Setor Campinas',             cep: '74503-030' },
    { id: 'est-24-outubro',    label: 'Estação 24 de Outubro',    bairro: 'Setor Campinas',             cep: '74503-040' },
    { id: 'est-lago-rosas',    label: 'Estação Lago das Rosas',   bairro: 'Setor Aeroporto',            cep: '74075-010' },
    { id: 'est-hgg',           label: 'Estação HGG',              bairro: 'Setor Aeroporto',            cep: '74075-020' },
    { id: 'est-joquei',        label: 'Estação Jóquei Clube',     bairro: 'Setor Central',              cep: '74013-010' },
    { id: 'est-rua-8',         label: 'Estação Rua 8',            bairro: 'Setor Central',              cep: '74013-020' },
    { id: 'est-rua-7',         label: 'Estação Rua 7',            bairro: 'Setor Central',              cep: '74013-030' },
    { id: 'est-rua-20',        label: 'Estação Rua 20',           bairro: 'Setor Central',              cep: '74013-040' },
    { id: 'est-botafogo',      label: 'Estação Botafogo',         bairro: 'Setor Universitário',        cep: '74605-020' },
    { id: 'est-universitaria', label: 'Estação Universitária',    bairro: 'Setor Vila Nova',            cep: '74643-010' },
    { id: 'est-v-bandeirantes',label: 'Estação Vila Bandeirantes',bairro: 'Vila Bandeirante',           cep: '74445-010' },
    { id: 'est-v-morais',      label: 'Estação Vila Morais',      bairro: 'Vila Morais',                cep: '74445-020' },
    { id: 'est-palmito',       label: 'Estação Palmito',          bairro: 'Jardim Novo Mundo',          cep: '74707-030' },
    { id: 'est-anhanguera',    label: 'Estação Anhanguera',       bairro: 'Jardim Novo Mundo',          cep: '74707-040' },
  ]}
];

const LOCAIS_MAP: Record<string, { id: string; label: string; bairro: string; cep: string }> = {};
LOCAIS_GRUPOS.forEach(g => g.itens.forEach(i => { LOCAIS_MAP[i.id] = i; }));

const NATUREZAS = [
  { id: 'patrulhamento',     label: 'Patrulhamento',           relato: 'REALIZA PATRULHAMENTO' },
  { id: 'estacionamento',    label: 'Ponto de estacionamento', relato: 'REALIZA PONTO DE ESTACIONAMENTO POLICIAL MILITAR' },
  { id: 'abordagem-pessoa',  label: 'Abordagem a pessoa',      relato: 'REALIZA ABORDAGEM A PESSOA' },
  { id: 'abordagem-veiculo', label: 'Abordagem a veículo',     relato: 'REALIZA ABORDAGEM A VEÍCULO' },
  { id: 'apoio',             label: 'Apoio a unidade',         relato: 'REALIZA APOIO A UNIDADE' },
  { id: 'verificacao',       label: 'Verificação de local',    relato: 'REALIZA VERIFICAÇÃO DE LOCAL' },
];

interface Registro {
  local: string;
  horario: string;
}

interface HistoricoItem {
  data: string;
  local: string;
  horario: string;
  rai: string;
  status: string;
}

export default function App() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [area, setArea] = useState('');
  const [viatura, setViatura] = useState('');
  const [registros, setRegistros] = useState<Registro[]>([{ local: '', horario: '12:00' }]);
  const [selectedNat, setSelectedNat] = useState<Set<string>>(new Set(['patrulhamento', 'estacionamento']));
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [identificacao, setIdentificacao] = useState({
    cmt: { nome: '', cpf: '' },
    mot: { nome: '', cpf: '' },
    aux: { nome: '', cpf: '' },
  });
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressText, setProgressText] = useState('Iniciando...');
  const [steps, setSteps] = useState<{ label: string; status: 'run' | 'done' }[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [openCards, setOpenCards] = useState({
    auth: true,
    identificacao: true,
    area: true,
    registros: true,
    naturezas: true,
    relato: true,
    historico: true,
  });

  const toggleCard = (card: keyof typeof openCards) => {
    setOpenCards(prev => ({ ...prev, [card]: !prev[card] }));
  };

  const CardHeader = ({ title, subtitle, icon: Icon, cardKey }: { title: string; subtitle: string; icon: any; cardKey: keyof typeof openCards }) => (
    <div 
      className="bg-gradient-to-br from-navy to-blue-dark px-4 py-3 flex items-center gap-2.5 cursor-pointer"
      onClick={() => toggleCard(cardKey)}
    >
      <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center shrink-0">
        <Icon className="w-[15px] h-[15px] text-white" />
      </div>
      <div className="flex-1">
        <div className="text-white text-[12px] font-semibold">{title}</div>
        <div className="text-white/55 text-[10px] uppercase tracking-[0.07em] mt-[1px]">{subtitle}</div>
      </div>
      <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${openCards[cardKey] ? '' : '-rotate-90'}`} />
    </div>
  );

  const handleAuthCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 3) v = v.slice(0, 3) + ' ' + v.slice(3, 6);
    setAuthCode(v);
  };

  const addRegistro = () => {
    if (registros.length >= 5) return;
    const proxHora = String(12 + registros.length).padStart(2, '0') + ':00';
    setRegistros([...registros, { local: '', horario: proxHora }]);
  };

  const removeRegistro = (index: number) => {
    setRegistros(registros.filter((_, i) => i !== index));
  };

  const updateRegistro = (index: number, field: keyof Registro, value: string) => {
    const newRegistros = [...registros];
    newRegistros[index][field] = value;
    setRegistros(newRegistros);
  };

  const toggleNatureza = (id: string) => {
    const newSet = new Set(selectedNat);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedNat(newSet);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const limpar = () => {
    setUsuario('');
    setSenha('');
    setAuthCode('');
    setArea('');
    setViatura('');
    setRegistros([{ local: '', horario: '12:00' }]);
    setSelectedNat(new Set());
  };

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const executar = async () => {
    const regValidos = registros.filter(r => r.local);

    if (!usuario || !senha || !authCode) { showToast('Preencha as credenciais SSP-GO'); return; }
    if (!viatura) { showToast('Informe o número da viatura'); return; }
    if (regValidos.length === 0) { showToast('Configure ao menos um registro com local'); return; }
    if (selectedNat.size === 0) { showToast('Selecione ao menos uma natureza'); return; }

    setIsExecuting(true);
    setSteps([]);
    
    const addStep = (label: string, status: 'run' | 'done') => {
      setSteps(prev => [...prev, { label, status }]);
    };
    const updateLastStep = (label: string, status: 'run' | 'done') => {
      setSteps(prev => {
        const newSteps = [...prev];
        if (newSteps.length > 0) {
          newSteps[newSteps.length - 1] = { label, status };
        }
        return newSteps;
      });
    };

    addStep('Conectando ao SSP-GO...', 'run');
    setProgressPct(5);
    setProgressText('Autenticando...');
    await delay(1200);
    updateLastStep('Login realizado com sucesso', 'done');

    addStep('Abrindo formulário de atendimento...', 'run');
    setProgressPct(15);
    setProgressText('Navegando no sistema...');
    await delay(900);
    updateLastStep('Formulário aberto', 'done');

    const hoje = new Date();
    const dataStr = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')} ${String(hoje.getHours()).padStart(2, '0')}:${String(hoje.getMinutes()).padStart(2, '0')}`;

    const newHistorico = [...historico];

    for (let i = 0; i < regValidos.length; i++) {
      const r = regValidos[i];
      const loc = LOCAIS_MAP[r.local];
      addStep(`Registrando RAI ${i + 1} — ${loc.label} (${r.horario})...`, 'run');
      
      const pct = 15 + ((i + 1) / regValidos.length) * 80;
      setProgressPct(pct - 10);
      setProgressText(`Preenchendo registro ${i + 1} de ${regValidos.length}...`);
      await delay(1500 + Math.random() * 500);

      const raiNum = String(46860000 + Math.floor(Math.random() * 1000));
      updateLastStep(`RAI ${i + 1} gerada — ${raiNum}`, 'done');

      newHistorico.unshift({ data: dataStr, local: loc.label, horario: r.horario, rai: raiNum, status: 'Gerada' });
      setHistorico([...newHistorico]); // Update state incrementally
      
      setProgressPct(pct);
      setProgressText(`Registro ${i + 1} concluído`);
    }

    setProgressPct(100);
    setProgressText('Automação concluída!');
    await delay(400);
    setIsExecuting(false);
    showToast(`${regValidos.length} RAI(s) gerada(s) com sucesso`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`RAI ${text} copiada`);
    });
  };

  const renderRelatoPreview = () => {
    const vtr = viatura.trim();
    const selecionadas = NATUREZAS.filter(n => selectedNat.has(n.id));
    const regComLocal = registros.filter(r => r.local);

    if (!vtr || selecionadas.length === 0 || regComLocal.length === 0) {
      return (
        <span className="text-text-muted font-sans text-[12px]">
          Configure os registros, viatura e naturezas para visualizar.
        </span>
      );
    }

    return regComLocal.map((r, i) => {
      const loc = LOCAIS_MAP[r.local];
      return (
        <div key={i} className="mb-2.5 pb-2.5 border-b border-dashed border-border last:mb-0 last:pb-0 last:border-0">
          <div className="text-[9px] font-bold text-text-muted uppercase tracking-[0.08em] font-sans mb-1.5">
            RAI {i + 1} · {r.horario} · {loc.label}
          </div>
          {selecionadas.map(n => (
            <div key={n.id}>
              EQUIPE DA <span className="text-blue-mid font-medium">VTR {vtr}</span> {n.relato} {loc.label.toUpperCase()} — {loc.bairro.toUpperCase()} — GOIÂNIA.
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface custom-scrollbar">
      {/* Topbar */}
      <header className="bg-navy border-b border-white/5 h-[52px] flex items-center justify-between px-5 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-[30px] h-[30px]">
             <Shield className="w-7 h-7 text-blue-dark fill-blue-dark" strokeWidth={1.2} />
             <Check className="w-3.5 h-3.5 text-[#418CFF] absolute" strokeWidth={3} />
          </div>
          <span className="text-white text-[15px] font-semibold tracking-[0.04em]">STIVE</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-dark border-[1.5px] border-blue-mid flex items-center justify-center text-[#93b4f0] text-[11px] font-semibold">
            CB
          </div>
          <span className="text-white/65 text-[12px]">Cb Fabrício</span>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-[200px] bg-navy2 border-r border-white/5 py-4 shrink-0 hidden md:block">
          <div className="mb-2">
            <div className="text-[10px] font-semibold text-white/30 tracking-[0.1em] uppercase px-4 pt-2 pb-1">Operacional</div>
            <div className="flex items-center gap-2 px-4 py-2 text-[12px] text-white/45 cursor-pointer hover:bg-white/5 hover:text-white/75 transition-colors border-l-2 border-transparent">
              <div className="w-[5px] h-[5px] rounded-full bg-current shrink-0" /> Dashboard
            </div>
            <div className="flex items-center gap-2 px-4 py-2 text-[12px] text-white/45 cursor-pointer hover:bg-white/5 hover:text-white/75 transition-colors border-l-2 border-transparent">
              <div className="w-[5px] h-[5px] rounded-full bg-current shrink-0" /> Escala
            </div>
            <div className="flex items-center gap-2 px-4 py-2 text-[12px] text-white/45 cursor-pointer hover:bg-white/5 hover:text-white/75 transition-colors border-l-2 border-transparent">
              <div className="w-[5px] h-[5px] rounded-full bg-current shrink-0" /> Cautelamento
            </div>
            <div className="flex items-center gap-2 px-4 py-2 text-[12px] text-white bg-blue-dark/40 border-l-2 border-blue-mid cursor-pointer transition-colors">
              <div className="w-[5px] h-[5px] rounded-full bg-current shrink-0" /> Automação RAI
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-white/30 tracking-[0.1em] uppercase px-4 pt-2 pb-1">Relatórios</div>
            <div className="flex items-center gap-2 px-4 py-2 text-[12px] text-white/45 cursor-pointer hover:bg-white/5 hover:text-white/75 transition-colors border-l-2 border-transparent">
              <div className="w-[5px] h-[5px] rounded-full bg-current shrink-0" /> Histórico
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="mb-5">
            <h1 className="text-[17px] font-semibold text-navy">Automação RAI</h1>
            <p className="text-[12px] text-text-muted mt-1">Registro automático de atendimento no sistema SSP-GO</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3.5">
              
              {/* AUTH CARD */}
              <div className="bg-card rounded-[10px] border border-border overflow-hidden">
                <CardHeader title="Autenticação SSP-GO" subtitle="Uma vez por turno" icon={Lock} cardKey="auth" />
                {openCards.auth && (
                  <div className="p-4">
                    <div className="flex items-start gap-2 bg-blue-bg border border-blue-border rounded-md px-3 py-2.5 text-[12px] text-blue-800 mb-3.5 leading-relaxed">
                      <Info className="w-[13px] h-[13px] shrink-0 mt-[1px]" />
                      Suas credenciais são usadas apenas para login e nunca ficam salvas no sistema.
                    </div>
                    <div className="flex gap-2.5 mb-3">
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-[0.07em] mb-1.5">Usuário</label>
                        <input 
                          type="text" 
                          value={usuario}
                          onChange={e => setUsuario(e.target.value)}
                          className="w-full h-[38px] border border-border rounded bg-gray-50 text-[13px] text-text-primary px-3 outline-none focus:border-blue-mid focus:bg-white focus:ring-[3px] focus:ring-blue-mid/10 transition-all"
                          placeholder="usuario.pm" 
                          autoComplete="off"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-[0.07em] mb-1.5">Senha</label>
                        <input 
                          type="password" 
                          value={senha}
                          onChange={e => setSenha(e.target.value)}
                          className="w-full h-[38px] border border-border rounded bg-gray-50 text-[13px] text-text-primary px-3 outline-none focus:border-blue-mid focus:bg-white focus:ring-[3px] focus:ring-blue-mid/10 transition-all"
                          placeholder="••••••••" 
                        />
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-end">
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-[0.07em] mb-1.5">Código Google Authenticator</label>
                        <input 
                          type="text" 
                          value={authCode}
                          onChange={handleAuthCodeChange}
                          className="w-full h-[38px] border border-border rounded bg-gray-50 text-[18px] text-text-primary px-3 outline-none focus:border-blue-mid focus:bg-white focus:ring-[3px] focus:ring-blue-mid/10 transition-all font-mono text-center font-medium tracking-[0.25em]"
                          placeholder="000 000" 
                          maxLength={7}
                          autoComplete="off"
                        />
                      </div>
                      <button 
                        className="h-[38px] px-6 bg-green-600 hover:bg-green-700 text-white text-[12px] font-semibold rounded transition-colors active:scale-[0.98] shrink-0"
                        onClick={() => showToast('Login realizado com sucesso (Simulação)')}
                      >
                        Logar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* IDENTIFICAÇÃO CARD */}
              <div className="bg-card rounded-[10px] border border-border overflow-hidden">
                <CardHeader title="Identificação" subtitle="Equipe e viatura" icon={User} cardKey="identificacao" />
                {openCards.identificacao && (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-[0.07em] mb-1.5">Número da viatura</label>
                      <input 
                        type="text" 
                        value={viatura}
                        onChange={e => setViatura(e.target.value)}
                        className="w-full h-[34px] border border-border rounded bg-gray-50 text-[12px] text-text-primary px-2.5 outline-none focus:border-blue-mid focus:bg-white transition-all"
                        placeholder="Ex: 815253" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-[0.07em]">Equipe composta</label>
                      {(['cmt', 'mot', 'aux'] as const).map((role) => (
                        <div key={role} className="grid grid-cols-12 gap-2">
                          <div className="col-span-2 flex items-center justify-center bg-gray-100 rounded text-[11px] font-bold text-text-secondary uppercase">
                            {role.toUpperCase()}
                          </div>
                          <div className="col-span-6">
                            <input 
                              type="text" 
                              placeholder="Nome"
                              value={identificacao[role].nome}
                              onChange={e => setIdentificacao(prev => ({ ...prev, [role]: { ...prev[role], nome: e.target.value } }))}
                              className="w-full h-[34px] border border-border rounded bg-gray-50 text-[12px] text-text-primary px-2.5 outline-none focus:border-blue-mid focus:bg-white transition-all"
                            />
                          </div>
                          <div className="col-span-4">
                            <input 
                              type="text" 
                              placeholder="CPF"
                              value={identificacao[role].cpf}
                              onChange={e => setIdentificacao(prev => ({ ...prev, [role]: { ...prev[role], cpf: e.target.value } }))}
                              className="w-full h-[34px] border border-border rounded bg-gray-50 text-[12px] text-text-primary px-2.5 outline-none focus:border-blue-mid focus:bg-white transition-all"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ÁREA DE PATRULHAMENTO */}
              <div className="bg-card rounded-[10px] border border-border overflow-hidden">
                <CardHeader title="Área de patrulhamento" subtitle="Local de atuação" icon={MapPin} cardKey="area" />
                {openCards.area && (
                  <div className="p-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-[0.07em] mb-1.5">Área de atuação</label>
                      <div className="relative">
                        <select 
                          value={area}
                          onChange={e => setArea(e.target.value)}
                          className="w-full h-[38px] border border-border rounded bg-gray-50 text-[11px] text-text-primary px-3 pr-8 outline-none focus:border-blue-mid focus:bg-white focus:ring-[3px] focus:ring-blue-mid/10 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">— Selecione a área —</option>
                          <option value="1">Área I — T. Vera Cruz / T. Pe. Pelágio / Est. Anicuns</option>
                          <option value="2">Área II — T. Dergo / T. Praça A / Est. Joquei Clube</option>
                          <option value="3">Área III — Est. Bandeirante Oeste / T. Praça da Bíblia / T. Novo Mundo</option>
                          <option value="4">Área IV — T. Isidória / T. Bandeiras / T. Gyn Viva / T. Pq Oeste</option>
                          <option value="5">Área V — Região da 44 / T. Paulo Garcia / T. Hailé Pinheiro / T. Recanto do Bosque</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      </div>
                      {area && AREAS[area] && (
                        <div className="inline-flex items-center gap-1.5 bg-blue-bg border border-blue-border rounded px-2.5 py-1 text-[12px] text-blue-dark font-medium mt-2">
                          <Phone className="w-3 h-3" />
                          <span>{AREAS[area].phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* REGISTROS CARD */}
              <div className="bg-card rounded-[10px] border border-border overflow-hidden">
                <CardHeader title="Registros — local e horário" subtitle="Até 5 RAIs · um local por registro" icon={Clock} cardKey="registros" />
                {openCards.registros && (
                  <div className="p-4">
                    <div className="flex flex-col gap-2.5">
                      {registros.map((r, i) => {
                        const isFilled = !!r.local;
                        const loc = LOCAIS_MAP[r.local];
                        const legend = loc ? `${loc.label} · ${loc.bairro}` : 'Selecione o local abaixo';

                        return (
                          <div key={i} className={`border rounded-lg overflow-hidden transition-colors ${isFilled ? 'border-blue-mid bg-blue-bg' : 'border-border bg-gray-50'}`}>
                            <div className={`flex items-center gap-2 px-3 py-2 border-b ${isFilled ? 'border-blue-200 bg-blue-50/80' : 'border-border-light bg-white/60'}`}>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white ${isFilled ? 'bg-blue-mid' : 'bg-text-muted'}`}>
                                {i + 1}
                              </div>
                              <span className={`text-[11px] font-semibold ${isFilled ? 'text-blue-dark' : 'text-text-secondary'}`}>
                                RAI {i + 1}
                              </span>
                              <span className={`text-[11px] italic flex-1 overflow-hidden text-ellipsis whitespace-nowrap ${isFilled ? 'text-blue-500' : 'text-text-muted'}`}>
                                {legend}
                              </span>
                              {registros.length > 1 && (
                                <button 
                                  onClick={() => removeRegistro(i)}
                                  className="text-[11px] text-red-400 hover:text-red-600 hover:bg-red-50 px-1.5 py-0.5 rounded transition-colors"
                                >
                                  remover
                                </button>
                              )}
                            </div>
                            <div className="p-3 grid grid-cols-2 gap-2">
                              <div className="col-span-2">
                                <label className="block text-[9px] font-semibold text-text-muted uppercase tracking-[0.07em] mb-1">Local do patrulhamento</label>
                                <div className="relative">
                                  <select 
                                    value={r.local}
                                    onChange={e => updateRegistro(i, 'local', e.target.value)}
                                    className="w-full h-[34px] border border-border rounded bg-gray-50 text-[11px] text-text-primary px-2.5 pr-8 outline-none focus:border-blue-mid focus:bg-white transition-all appearance-none cursor-pointer"
                                  >
                                    <option value="">— Selecione o local —</option>
                                    {LOCAIS_GRUPOS.map(g => (
                                      <optgroup key={g.grupo} label={g.grupo}>
                                        {g.itens.map(item => (
                                          <option key={item.id} value={item.id}>{item.label} — {item.bairro}</option>
                                        ))}
                                      </optgroup>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-text-muted uppercase tracking-[0.07em] mb-1">Horário do registro</label>
                                <input 
                                  type="time" 
                                  value={r.horario}
                                  onChange={e => updateRegistro(i, 'horario', e.target.value)}
                                  className="w-full h-[34px] border border-border rounded bg-gray-50 text-[12px] text-text-primary px-2.5 outline-none focus:border-blue-mid focus:bg-white transition-all appearance-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-text-muted uppercase tracking-[0.07em] mb-1">CEP (automático)</label>
                                <div className={`flex items-center gap-1.5 border rounded px-2 h-[34px] text-[12px] font-mono overflow-hidden ${loc ? 'border-green-300 bg-green-50 text-green-800' : 'border-border bg-white text-text-muted font-sans text-[11px]'}`}>
                                  {loc ? (
                                    <>
                                      <Check className="w-3 h-3 shrink-0" strokeWidth={3} />
                                      {loc.cep}
                                    </>
                                  ) : 'Aguardando seleção...'}
                                </div>
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[9px] font-semibold text-text-muted uppercase tracking-[0.07em] mb-1">Bairro / Setor (automático)</label>
                                <div className={`flex items-center gap-1.5 border rounded px-2 h-[34px] text-[12px] font-mono overflow-hidden ${loc ? 'border-green-300 bg-green-50 text-green-800' : 'border-border bg-white text-text-muted font-sans text-[11px]'}`}>
                                  {loc ? (
                                    <>
                                      <Check className="w-3 h-3 shrink-0" strokeWidth={3} />
                                      {loc.bairro} — Goiânia / GO
                                    </>
                                  ) : 'Aguardando seleção...'}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {registros.length < 5 && (
                      <button 
                        onClick={addRegistro}
                        className="mt-2.5 w-full flex items-center justify-center gap-1.5 border-[1.5px] border-dashed border-gray-300 rounded-lg p-2.5 text-[12px] text-text-muted hover:border-blue-mid hover:text-blue-mid hover:bg-blue-bg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Adicionar registro
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-3.5">
              
              {/* NATUREZAS CARD */}
              <div className="bg-card rounded-[10px] border border-border overflow-hidden">
                <CardHeader title="Naturezas da ocorrência" subtitle="Aplicada a todos os registros" icon={ListChecks} cardKey="naturezas" />
                {openCards.naturezas && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {NATUREZAS.map(n => {
                        const isSelected = selectedNat.has(n.id);
                        return (
                          <div 
                            key={n.id}
                            onClick={() => toggleNatureza(n.id)}
                            className={`flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer select-none transition-colors ${isSelected ? 'border-blue-mid bg-blue-bg' : 'border-border bg-gray-50 hover:border-blue-300 hover:bg-blue-50'}`}
                          >
                            <div className={`w-4 h-4 shrink-0 border-[1.5px] rounded-[3px] flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-mid border-blue-mid' : 'border-gray-300'}`}>
                              {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-[12px] text-text-primary leading-tight">{n.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* RELATO CARD */}
              <div className="bg-card rounded-[10px] border border-border overflow-hidden">
                <CardHeader title="Relato PM — pré-visualização" subtitle="Um bloco por registro" icon={FileText} cardKey="relato" />
                {openCards.relato && (
                  <div className="p-4">
                    <div className="bg-slate-50 border border-border rounded p-3 text-[11.5px] font-mono text-text-primary leading-[1.8] min-h-[60px] break-words">
                      {renderRelatoPreview()}
                    </div>
                    <div className="text-[11px] text-text-muted mt-1.5 font-sans">Um relato por natureza · aplicado a cada local selecionado</div>
                  </div>
                )}
              </div>

              {/* HISTORICO CARD */}
              <div className="bg-card rounded-[10px] border border-border overflow-hidden">
                <CardHeader title="RAIs registradas hoje" subtitle="Clique em copiar para enviar ao superior" icon={History} cardKey="historico" />
                {openCards.historico && (
                  <div className="p-4">
                    {historico.length === 0 ? (
                      <div className="text-[12px] text-text-muted text-center py-4">Nenhuma RAI gerada ainda hoje.</div>
                    ) : (
                      <div className="space-y-0">
                        {historico.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 py-2 border-b border-border-light last:border-0 text-[12px]">
                            <span className="text-text-muted min-w-[70px] text-[11px] shrink-0">{h.data}</span>
                            <span className="text-text-primary font-medium flex-1 text-[11px] overflow-hidden text-ellipsis whitespace-nowrap">{h.local}</span>
                            <span className="text-text-secondary min-w-[40px] font-mono text-[11px] shrink-0">{h.horario}</span>
                            <span className="font-mono text-blue-dark font-semibold text-[12px] shrink-0">{h.rai}</span>
                            <span className={`inline-flex items-center text-[10px] rounded-full px-2 py-0.5 font-semibold shrink-0 ${h.status === 'Gerada' ? 'bg-green-bg text-green-text' : 'bg-red-bg text-red-text'}`}>
                              {h.status}
                            </span>
                            <button 
                              onClick={() => copyToClipboard(h.rai)}
                              disabled={h.status !== 'Gerada'}
                              className="bg-blue-bg border border-blue-border rounded px-2 py-1 text-[11px] text-blue-dark hover:bg-blue-100 transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Copiar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PROGRESS */}
              {isExecuting && (
                <div className="mt-3.5">
                  <div className="flex justify-between text-[11px] text-text-secondary mb-1.5">
                    <span>{progressText}</span>
                    <span>{Math.round(progressPct)}%</span>
                  </div>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-mid rounded-full transition-all duration-400 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="mt-2.5 space-y-1">
                    {steps.map((step, i) => (
                      <div key={i} className={`flex items-center gap-2 py-1 text-[11px] ${step.status === 'run' ? 'text-blue-mid' : step.status === 'done' ? 'text-green-text' : 'text-text-muted'}`}>
                        {step.status === 'run' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                        ) : (
                          <div className="w-[7px] h-[7px] rounded-full bg-current shrink-0" />
                        )}
                        <span>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  onClick={limpar}
                  disabled={isExecuting}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded text-[12px] font-medium border border-border text-text-secondary hover:bg-border-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Limpar
                </button>
                <button 
                  onClick={executar}
                  disabled={isExecuting}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded text-[12px] font-medium bg-navy text-white border border-navy hover:bg-blue-dark hover:border-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  Executar automação
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* TOAST */}
      <div className={`fixed bottom-6 right-6 bg-gray-900 text-white rounded-lg px-4 py-2.5 text-[12px] font-medium transition-all duration-250 z-[999] pointer-events-none max-w-[280px] shadow-lg ${toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        {toastMsg}
      </div>
    </div>
  );
}
