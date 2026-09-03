# SpaceCell Core D2C 🚀📡
### Next-Generation Non-Terrestrial Network (NTN) & Native Direct-to-Cell Aerospace Core

---

## 🛰️ Visão Geral do Ecossistema

O **SpaceCell Core D2C (Direct-to-Cell)** é uma plataforma de infraestrutura de telecomunicações altamente disruptiva, projetada especificamente para orquestrar e processar conexões de rede de borda entre satélites de órbita baixa (**LEO - Low Earth Orbit**) e dispositivos móveis LTE/5G convencionais totalmente comerciais (smartphones de prateleira, sensores IoT e maquinários industriais), eliminando por completo a necessidade de antenas externas modificadas ou ERBs terrestres intermediárias.

A plataforma atua como o **Core Engine** da arquitetura, implementando os padrões globais de conectividade espacial definidos pelo **3GPP Release 17 e Release 18 (Non-Terrestrial Networks - NTN)**. Ao invés de competir com as constelações de satélites existentes, o SpaceCell funciona como a camada de software crítica e inteligente que viabiliza o escoamento massivo de pacotes de dados, voz estruturada e mensagens de emergência (SOS) a partir de nós de borda terrestres como o gateway **AETHER-9**.

---

## ⚡ Descrição Estendida e Arquitetura de Engenharia

O maior gargalo físico enfrentado pelas telecomunicações espaciais Direct-to-Device puras reside na atenuação do espaço livre (Path Loss) e nas restrições de link budget (orçamento de enlace), que limitam as conexões de satélites diretos a banda estreita (apenas pequenas mensagens de texto). O **SpaceCell Core D2C** resolve essa limitação através de uma arquitetura híbrida de computação de borda dividida em módulos altamente acoplados matematicamente:

### 1. Mecanismo de Compensação Doppler e Timing Advance
Satélites LEO cruzam o céu a velocidades que superam 27.000 km/h, gerando um desvio dinâmico de frequência violento (Efeito Doppler) e variações contínuas de atraso de propagação. Este módulo executa algoritmos de correção preditiva baseados em dados de efemérides (Ephemeris/NORAD ID) em microssegundos, ajustando o *Timing Advance* diretamente na camada física-digital para que o smartphone do usuário final perceba o link em movimento como uma célula terrestre estática.

### 2. Handover Orbital e Roteamento Óptico de Malha
Gerencia a transferência de conectividade (*Handover*) contínua e sem quedas (SLA de 99,99%) à medida que um satélite sai do horizonte do terminal e o próximo entra na malha operacional, coordenando o tráfego através de links ópticos inter-satélites (ISL).

### 3. Core Virtualizado Zero-Trust e Gestão de Royalties
Uma suíte completa de *Virtual Evolved Packet Core* (vEPC) rodando nativamente em nuvem de alto desempenho. O sistema orquestra a validação global de identidades móveis internacionais (IMSI/HLR/HSS), criptografia de ponta a ponta resiliente a interferências eletromagnéticas (Anti-Jamming com AES-256 e mTLS 1.3) e contabiliza de forma automatizada e imutável as taxas de intermediação e divisão de caixa (*Revenue Share*) das franquias regionais distribuídas ao redor do globo.

---

## 🛠️ Especificações Técnicas e Tecnologias

* **Backend / Runtime Engine:** Node.js (Ambiente estrito orientado a ES Modules).
* **Camada de Orquestração RF:** APIs de telemetria adaptadas para gRPC seguro e mensageria de ultra-baixa latência (MQTT mTLS).
* **Conformidade de Segurança:** Arquitetura Zero-Trust com headers estritos de isolamento cibernético, sanitização ativa contra XSS/Injeções de código e conformidade com a LGPD (Lei nº 13.709/2018).
* **Padrões Suportados:** 3GPP LTE/5G NTN (Bandas n255 / n256 e espectros compartilhados Banda S / Banda L).

---

## 🏢 Integração com o Gateway Hub AETHER-9

O Core foi estruturado para receber o fluxo de dados do transceptor **AETHER-9**, um hardware baseado em antenas de varredura eletrônica ativa (**AESA - Phased Array**). O fluxo opera da seguinte forma:

1. **Uplink:** O AETHER-9 rastreia digitalmente a constelação LEO através de feixes estreitos ajustados por *Beamforming* 3D em bandas de alta velocidade (Banda Ka/Ku).
2. **Processamento Central:** O **SpaceCell Core** decodifica os pacotes em nuvem, corrigindo os atrasos orbitais.
3. **Downlink:** O sinal é redistribuído em frequências celulares nativas e interpretado no smartphone do usuário por meio de um **eSIM Virtual Satelital (Software SIM)** ativado instantaneamente via QR Code.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
Antes de iniciar, certifique-se de possuir em seu ambiente de desenvolvimento:
* [Node.js](https://nodejs.org) (Versão recomendada: v24+)
* [Git](https://git-scm.com)

### Instalação e Inicialização
1. Clone o repositório ou navegue até a pasta do projeto:
   ```bash
   cd "C:\Users\REALJ\Desktop\Direct-to-Cell nativas via satélite"
   ```

2. Instale as dependências de forma limpa:
   ```bash
   npm install
   ```

3. Configure o arquivo de variáveis de ambiente de segurança baseado no modelo base:
   * Crie um arquivo `.env` na raiz do projeto.
   * Insira suas chaves secretas de produção e credenciais de banco de dados locais.

4. Inicie o servidor em modo de desenvolvimento local:
   ```bash
   npm run dev
   ```
   *O sistema inicializará a malha de conformidade na porta configurada (Padrão: `http://localhost:3000` ou `3001`).*

---

## 📄 Licença e Propriedade Intelectual

Este software e sua respectiva arquitetura de topologia de dados regulatórios estão licenciados sob os termos da **Licença Apache, Versão 2.0**. 

