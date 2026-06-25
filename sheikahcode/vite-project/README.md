# Sheikah Slate

Uma lista de tarefas (to-do list) inspirada na **Sheikah Slate** de _The Legend of Zelda: Breath of the Wild_. Em vez de "tarefas", você gerencia **quests** — e para concluir uma quest é preciso anexar uma foto como prova, que vai parar na Galeria.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

## Funcionalidades

- **Criar quests** com título, descrição e tipo (`Main` ou `Side`)
- **Filtrar** as quests por tipo (Main, Side ou Todas)
- **Editar a descrição** de uma quest a qualquer momento
- **Concluir uma quest** anexando uma foto (câmera ou arquivo)
- **Galeria** com as fotos de todas as quests concluídas
- **Deletar** quests
- **Persistência local**: tudo é salvo no `localStorage` do navegador — sem backend
- **Estética Sheikah**: tema escuro, paleta ciano, fontes Cinzel/Rajdhani, grade e olho Sheikah desenhados em SVG no fundo, e efeito de _scanlines_

## Tecnologias

- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/)
- **CSS Modules** para estilos isolados por componente
- **Context API** (`QuestContext`) para o estado global, com persistência via `localStorage`

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) instalado.

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento (Vite mostra a URL local)
npm run dev

# 3. Gerar a build de produção (sai na pasta dist/)
npm run build

# Pré-visualizar a build de produção
npm run preview

# Rodar o linter
npm run lint
```

## Estrutura do projeto

```
src/
├── App.jsx                  # Monta o app e alterna entre Home e Galeria
├── main.jsx                 # Ponto de entrada do React
├── components/
│   ├── layout/              # Estrutura base: SVG de fundo (grade + olho Sheikah) e scanlines
│   ├── TopBar/              # Cabeçalho com o título da tela atual
│   ├── BottomNav/           # Navegação entre Home e Galeria
│   ├── HomeScreen/          # Lista de quests ativas + filtros + botão de criar
│   ├── GalleryScreen/       # Grade com as fotos das quests concluídas
│   ├── QuestCard/           # Cartão de uma quest individual
│   ├── CreateQuestModal/    # Formulário para criar uma nova quest
│   └── QuestDetailModal/    # Detalhes da quest: editar descrição, concluir (foto) e deletar
├── context/
│   └── QuestContext.jsx     # Estado global das quests + persistência no localStorage
└── styles/
    └── sheikah.css          # Variáveis de CSS (cores e fontes do tema)
```

## Como funciona

Todo o estado das quests vive em um único lugar: o **`QuestContext`**. Ele guarda a lista de quests e expõe as funções `addQuest`, `updateQuest`, `completeQuest` e `deleteQuest`. Qualquer componente acessa esses dados pelo hook `useQuests()`.

Cada quest é um objeto assim:

```js
{
  id: "uuid",          // gerado com crypto.randomUUID()
  title: "...",        // nome da quest
  type: "main",        // "main" ou "side"
  description: "...",  // texto livre
  photo: null          // null = ativa | dataURL da imagem = concluída
}
```

O campo `photo` é o que separa uma quest **ativa** de uma **concluída**:

- A **HomeScreen** mostra apenas quests com `photo === null` (ainda não concluídas).
- A **GalleryScreen** mostra apenas quests com `photo !== null` (concluídas).
- Concluir uma quest = escolher uma imagem, que é convertida em _Data URL_ (`FileReader`) e salva no campo `photo`.

Sempre que a lista de quests muda, um `useEffect` grava tudo no `localStorage` (chave `sheikah-quests`). Por isso os dados continuam lá mesmo depois de fechar o navegador.
