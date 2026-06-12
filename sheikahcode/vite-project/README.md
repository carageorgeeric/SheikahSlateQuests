# Sheikah Slate

Uma lista de tarefas inspirada no Sheikah Slate de *The Legend of Zelda: Breath of the Wild*.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)

## Funcionalidades

- Criar quests (Main Quests e Side Quests)
- Concluir quests anexando uma foto
- Galeria com todas as quests concluídas
- Deletar quests tanto da tela inicial quanto da galeria
- Dados salvos no `localStorage` — sem necessidade de backend
- Estética Sheikah: tema escuro, paleta ciano, fontes Cinzel/Rajdhani, olho Sheikah animado no fundo

## Tecnologias

- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/)
- CSS Modules
- Context API + localStorage

## Como rodar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

## Estrutura do projeto

```
src/
├── components/
│   ├── layout/            # Estrutura base com SVG de fundo e scanlines
│   ├── TopBar/            # Cabeçalho com título
│   ├── BottomNav/         # Navegação entre Home e Galeria
│   ├── HomeScreen/        # Lista de quests com filtros
│   ├── GalleryScreen/     # Grade de fotos das quests concluídas
│   ├── QuestCard/         # Item individual de quest
│   ├── CreateQuestModal/  # Formulário para criar uma nova quest
│   ├── QuestDetailModal/  # Detalhes, descrição e conclusão da quest
│   └── SplashScreen/      # Tela de introdução
├── context/
│   └── QuestContext.jsx   # Estado global com persistência no localStorage
└── styles/
    └── sheikah.css        # Variáveis CSS (cores e fontes)
```
