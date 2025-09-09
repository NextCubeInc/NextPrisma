# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/97352822-26dd-4947-b8b4-a9e49fc83b0b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/97352822-26dd-4947-b8b4-a9e49fc83b0b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/97352822-26dd-4947-b8b4-a9e49fc83b0b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
<<<<<<< HEAD

=======




##
loss
    - Creditos Extras
    - 

## shadcn - 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
## SUPABASE
TOK sbp_cc7d6266b8448dcb5b04e1f8c91d4fc541ac2117
/*"supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=<project-ref>"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_cc7d6266b8448dcb5b04e1f8c91d4fc541ac2117"
      }
    },*/


Google Ads (rede de pesquisa, display, YouTube, apps)

Bing Ads / Microsoft Advertising (inclui Yahoo e AOL)

Yahoo Gemini (misto de search + native ads)

Yandex Ads (forte na Rússia e leste europeu)

Baidu Ads (mercado chinês)

Meta Ads (Facebook, Instagram, Messenger, Audience Network)

TikTok Ads

LinkedIn Ads

Twitter Ads / X Ads

Pinterest Ads

Snapchat Ads

Reddit Ads

Quora Ads

Twitch Ads (Amazon Ads)

Spotify Ads (áudio e banners)

Deezer Ads

Hulu Ads (nos EUA, via Disney Advertising)

Mercado Livre Ads (Meli Ads)

Shopee Ads

Etsy Ads

Walmart Connect (EUA)

Rakuten Ads

Alibaba/Aliexpress Ads

eBay Ads

Shopee Ads

Rakuten Ads

Unity Ads (games)

AppLovin

ironSource

Chartboost

AdColony

Apple Search Ads (para apps iOS)

Taboola (native ads)

Outbrain (native ads)

MGID (native ads)

AdRoll (remarketing e retargeting)

Criteo (retargeting para e-commerce)

Unity Ads (jogos mobile)

IronSource (jogos mobile)

AppLovin (mobile e games)

AdColony (mobile vídeo ads)

PropellerAds (tráfego pop-under, push notifications, etc.)

RevContent (native ads)

BuySellAds (rede de mídia display direta)



```
Project "Sistema de Análise de Marketing" {
database_type: 'PostgreSQL'
Note: 'Design de banco de dados relacional para um sistema de análise de marketing, incluindo usuários, workspaces, planos, integrações, dashboards, analytics, criativos, competidores e alertas.'
}

enum integration_type {
"Facebook Ads" [note: 'Integração com a plataforma Facebook Ads']
"Google Ads" [note: 'Integração com a plataforma Google Ads']
"TikTok Ads" [note: 'Integração com a plataforma TikTok Ads']
"LinkedIn Ads" [note: 'Integração com a plataforma LinkedIn Ads']
"Twitter Ads" [note: 'Integração com a plataforma Twitter Ads']
"Google Analytics" [note: 'Integração com o Google Analytics']
}

enum integration_status {
active [note: 'A integração está ativa e funcionando']
inactive [note: 'A integração está inativa']
error [note: 'A integração encontrou um erro']
}

enum creative_type {
image [note: 'Criativo do tipo imagem']
video [note: 'Criativo do tipo vídeo']
text [note: 'Criativo do tipo texto']
carousel [note: 'Criativo do tipo carrossel']
}

enum alert_type {
performance_drop [note: 'Alerta de queda de desempenho']
budget_exceeded [note: 'Alerta de orçamento excedido']
new_competitor_ad [note: 'Alerta de novo anúncio de concorrente']
custom_metric [note: 'Alerta para métrica personalizada']
}

enum alert_status {
active [note: 'O alerta está ativo e aguardando gatilho']
triggered [note: 'O alerta foi disparado']
resolved [note: 'O alerta foi resolvido']
}

Table users {
id serial [pk, increment, not null]
name varchar(255) [not null, note: 'Nome completo do usuário']
email varchar(255) [unique, not null, note: 'Endereço de e-mail do usuário, usado para login']
password_hash varchar(255) [not null, note: 'Hash da senha do usuário']
created_at timestamp [not null, default: `now()`, note: 'Data e hora de criação do registro']
updated_at timestamp [not null, default: `now()`, note: 'Data e hora da última atualização do registro']

indexes {
email [unique, name: 'idx_users_email']
}
Note: 'Armazena informações dos usuários do sistema.'
}

Table plans {
id serial [pk, increment, not null]
name varchar(100) [unique, not null, note: 'Nome do plano (ex: Básico, Premium)']
description text [note: 'Descrição detalhada do plano']
price decimal(10, 2) [not null, note: 'Preço mensal do plano']
features jsonb [note: 'Recursos incluídos no plano, em formato JSON']
created_at timestamp [not null, default: `now()`, note: 'Data e hora de criação do registro']
updated_at timestamp [not null, default: `now()`, note: 'Data e hora da última atualização do registro']

indexes {
name [unique, name: 'idx_plans_name']
}
Note: 'Define os diferentes planos de assinatura disponíveis.'
}

Table workspaces {
id serial [pk, increment, not null]
name varchar(255) [not null, note: 'Nome do workspace']
owner_id integer [not null, ref: > users.id, note: 'ID do usuário proprietário do workspace']
plan_id integer [not null, ref: > plans.id, note: 'ID do plano de assinatura associado a este workspace']
created_at timestamp [not null, default: `now()`, note: 'Data e hora de criação do registro']
updated_at timestamp [not null, default: `now()`, note: 'Data e hora da última atualização do registro']

indexes {
owner_id [name: 'idx_workspaces_owner_id']
plan_id [name: 'idx_workspaces_plan_id']
}
Note: 'Representa um ambiente de trabalho onde os usuários gerenciam suas campanhas e dados.'
}

Table integrations {
id serial [pk, increment, not null]
workspace_id integer [not null, ref: > workspaces.id, note: 'ID do workspace ao qual a integração pertence']
type integration_type [not null, note: 'Tipo da plataforma de integração (ex: Facebook Ads, Google Ads)']
api_key varchar(255) [note: 'Chave de API ou token de acesso (deve ser armazenado criptografado)']
status integration_status [not null, default: 'inactive', note: 'Status atual da integração']
configuration jsonb [note: 'Configurações específicas da integração, em formato JSON']
created_at timestamp [not null, default: `now()`, note: 'Data e hora de criação do registro']
updated_at timestamp [not null, default: `now()`, note: 'Data e hora da última atualização do registro']

indexes {
workspace_id [name: 'idx_integrations_workspace_id']
(workspace_id, type) [unique, name: 'idx_integrations_workspace_type']
}
Note: 'Armazena as configurações para conectar a plataformas de publicidade e análise externas.'
}

Table dashboards {
id serial [pk, increment, not null]
workspace_id integer [not null, ref: > workspaces.id, note: 'ID do workspace ao qual o dashboard pertence']
name varchar(255) [not null, note: 'Nome do dashboard']
configuration jsonb [not null, note: 'Configuração dos widgets e layout do dashboard, em formato JSON']
created_at timestamp [not null, default: `now()`, note: 'Data e hora de criação do registro']
updated_at timestamp [not null, default: `now()`, note: 'Data e hora da última atualização do registro']

indexes {
workspace_id [name: 'idx_dashboards_workspace_id']
}
Note: 'Armazena os dashboards personalizados criados pelos usuários.'
}

Table analytics_data {
id serial [pk, increment, not null]
integration_id integer [not null, ref: > integrations.id, note: 'ID da integração de onde os dados foram coletados']
report_date date [not null, note: 'Data a que os dados analíticos se referem']
metrics jsonb [not null, note: 'Métricas coletadas (ex: impressões, cliques, custo), em formato JSON']
created_at timestamp [not null, default: `now()`, note: 'Data e hora de criação do registro']
updated_at timestamp [not null, default: `now()`, note: 'Data e hora da última atualização do registro']

indexes {
integration_id [name: 'idx_analytics_data_integration_id']
report_date [name: 'idx_analytics_data_report_date']
(integration_id, report_date) [unique, name: 'idx_analytics_data_integration_date']
}
Note: 'Armazena os dados analíticos coletados das integrações.'
}

Table creatives {
id serial [pk, increment, not null]
workspace_id integer [not null, ref: > workspaces.id, note: 'ID do workspace ao qual o criativo pertence']
integration_id integer [null, ref: > integrations.id, note: 'ID da integração através da qual o criativo foi publicado, se aplicável']
name varchar(255) [not null, note: 'Nome do criativo']
type creative_type [not null, note: 'Tipo do criativo (imagem, vídeo, texto)']
url varchar(2048) [note: 'URL do ativo do criativo (imagem, vídeo)']
description text [note: 'Descrição ou texto do criativo']
metadata jsonb [note: 'Metadados adicionais do criativo, em formato JSON']
created_at timestamp [not null, default: `now()`, note: 'Data e hora de criação do registro']
updated_at timestamp [not null, default: `now()`, note: 'Data e hora da última atualização do registro']

indexes {
workspace_id [name: 'idx_creatives_workspace_id']
integration_id [name: 'idx_creatives_integration_id']
}
Note: 'Armazena informações sobre os criativos de marketing utilizados nas campanhas.'
}

Table competitors {
id serial [pk, increment, not null]
workspace_id integer [not null, ref: > workspaces.id, note: 'ID do workspace que está monitorando o concorrente']
name varchar(255) [not null, note: 'Nome do concorrente']
url varchar(2048) [note: 'URL do site ou perfil do concorrente']
created_at timestamp [not null, default: `now()`, note: 'Data e hora de criação do registro']
updated_at timestamp [not null, default: `now()`, note: 'Data e hora da última atualização do registro']

indexes {
workspace_id [name: 'idx_competitors_workspace_id']
(workspace_id, name) [unique, name: 'idx_competitors_workspace_name']
}
Note: 'Armazena informações sobre os concorrentes monitorados por um workspace.'
}

Table alerts {
id serial [pk, increment, not null]
workspace_id integer [not null, ref: > workspaces.id, note: 'ID do workspace ao qual o alerta pertence']
user_id integer [not null, ref: > users.id, note: 'ID do usuário que configurou o alerta']
type alert_type [not null, note: 'Tipo do alerta (ex: queda de desempenho, orçamento excedido)']
threshold jsonb [not null, note: 'Condições ou valores de limite para disparar o alerta, em formato JSON']
status alert_status [not null, default: 'active', note: 'Status atual do alerta']
message text [note: 'Mensagem ou descrição do alerta']
last_triggered_at timestamp [note: 'Data e hora da última vez que o alerta foi disparado']
created_at timestamp [not null, default: `now()`, note: 'Data e hora de criação do registro']
updated_at timestamp [not null, default: `now()`, note: 'Data e hora da última atualização do registro']

indexes {
workspace_id [name: 'idx_alerts_workspace_id']
user_id [name: 'idx_alerts_user_id']
type [name: 'idx_alerts_type']
}
Note: 'Armazena os alertas configurados pelos usuários para monitorar métricas e eventos importantes.'
}
```
>>>>>>> parent of 415c043 (feat: implementa sistema de autenticação e workspaces com Supabase)
