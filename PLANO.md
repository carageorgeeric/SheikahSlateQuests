# Sheikah Slate — Plano de Implementação

## O Dado Base (já definido)

```javascript
{
  id: crypto.randomUUID(),   // gerado na criação
  title: "Nome da Quest",
  type: "main" | "side",
  description: "Texto da quest...",
  photo: null  // null = incompleta | string base64 = completa
}

// Derivados — calcular na hora, não guardar:
// rupees:      quest.type === 'main' ? 50 : 25
// isCompleted: quest.photo !== null
```

---

## FASE 1 — Limpeza e Setup

### Tarefa 1 — Renomear QuestContest.jsx → QuestContext.jsx

Arquivo com typo. Renomeia e verifica se há algum import do nome antigo pra corrigir.

---

### Tarefa 2 — Limpar App.jsx e App.css

Apaga todo o conteúdo padrão do Vite. O `App.jsx` vai virar só a casca de navegação do app. Por enquanto, deixa retornando uma `<div>` vazia.

---

## FASE 2 — O Cérebro do App

### Tarefa 3 — QuestContext.jsx

O Context é o estado global do app. Ele guarda o array de quests e expõe as funções de CRUD.

**O que exportar:**

```javascript
// O Provider — vai envolver o app inteiro no App.jsx
export function QuestProvider({ children }) { ... }

// O hook pra qualquer componente consumir
export function useQuests() {
  return useContext(QuestContext)
}
```

**Funções que o Context precisa ter:**

| Função | O que faz |
|---|---|
| `addQuest(data)` | Cria quest nova com id gerado |
| `updateQuest(id, changes)` | Atualiza campos de uma quest pelo id |
| `completeQuest(id, photo)` | Adiciona a foto à quest (= concluir) |
| `deleteQuest(id)` | Remove a quest pelo id |

**Dicas:**
- `updateQuest` → pesquisa `Array.map()`. Como usar ele pra transformar só um item da lista e deixar os outros iguais?
- `deleteQuest` → pesquisa `Array.filter()`. Como remover um item de uma lista sem mutar o array original?

**Referência:** [React Docs — Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)

**Exemplo do mundo real:** O carrinho do iFood é um Context — qualquer tela (cardápio, resumo, pagamento) lê e modifica sem prop drilling.

**Como saber que está pronto:** Você consegue chamar `useQuests()` em qualquer componente e ter acesso ao array e às funções.

---

## FASE 3 — A Casca de Navegação

### Tarefa 4 — App.jsx

O App controla qual tela está visível. Estado inicial: `'splash'`.

**Lógica de navegação (pseudocódigo):**

```
currentScreen === 'splash'  →  <SplashScreen onFinish={() => ir pra 'home'} />
currentScreen === 'home'    →  <HomeScreen />
currentScreen === 'gallery' →  <GalleryScreen />
```

**O que mais vai estar aqui:**
- `<QuestProvider>` envolvendo tudo
- `<TopBar>` e `<BottomNav>` — mas só quando NÃO estiver na splash

**Dica:** Para passar a função de navegar pro BottomNav, props simples são suficientes. Não precisa de Context pra isso.

**Exemplo do mundo real:** O Instagram faz exatamente isso — a tab bar muda um estado central que controla qual aba está visível.

---

## FASE 4 — As Telas

> **Regra de ouro:** Faz funcionar primeiro, faz bonito depois. CSS vem por último.

### Tarefa 5 — SplashScreen

Aparece uma vez, some automaticamente. Não tem dados.

**Conceito novo — `useEffect`:** Roda código "fora" do render — timers, chamadas de API, etc.

**Dica:**

```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    onFinish() // prop recebida do App.jsx
  }, 3000)

  return () => clearTimeout(timer) // limpeza obrigatória
}, []) // [] = roda só uma vez ao montar
```

**Referência:** [React Docs — useEffect](https://react.dev/reference/react/useEffect) | [MDN — setTimeout](https://developer.mozilla.org/pt-BR/docs/Web/API/setTimeout)

**Visual:** O arquivo `ref/botw_mobile_template.html` tem uma animação de shimmer no Sheikah Eye — boa base pra usar aqui.

**Como saber que está pronto:** App abre na Splash, espera ~3s, vai pra Home automaticamente.

---

### Tarefa 6 — TopBar

Barra superior com o nome da tela atual. Recebe `title` como prop. Sem lógica por enquanto.

---

### Tarefa 7 — BottomNav

Dois botões: Home e Gallery. Não aparece na Splash (o App.jsx já controla isso).

**Props que precisa receber:**
- `currentScreen` — pra destacar o botão ativo
- `onNavigate(screen)` — função pra mudar de tela

**Exemplo do mundo real:** Tab bar do WhatsApp (Conversas, Status, Ligações) — destaca a aba ativa.

---

### Tarefa 8 — HomeScreen (com mock data)

Começa com um array **hardcoded** de quests. Só troca pelo `useQuests()` quando a tela estiver funcionando visualmente.

**Elementos da tela:**
1. Filtro de tipo: Todas / Main / Side
2. Lista de `<QuestCard />`
3. Botão de adicionar nova quest

**Dica pro filtro:**

```javascript
const questsToShow = filter === 'all'
  ? quests
  : quests.filter(q => q.type === filter)
```

---

### Tarefa 9 — QuestCard

Componente que representa uma quest na lista. Recebe um objeto `quest` via prop.

**O que mostrar:**
- Título
- Badge Main / Side
- Rupees (derivado — calcular aqui, não vem do objeto)
- Indicador visual de completa (`quest.photo !== null`)

---

### Tarefa 10 — Modal de Criar Quest

Aparece sobre a HomeScreen quando clica em "Adicionar". Formulário com título, toggle Main/Side, e descrição.

**Controle do modal no HomeScreen:**

```javascript
const [isModalOpen, setIsModalOpen] = useState(false)
```

**Formulários controlados em React — cada campo tem um estado:**

```javascript
const [title, setTitle] = useState('')
// <input value={title} onChange={e => setTitle(e.target.value)} />
```

**Referência:** [React Docs — Controlled Components](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)

**No submit:** Chama `addQuest()` do Context com os dados, fecha o modal.

**Exemplo do mundo real:** Modal de "Nova tarefa" do Todoist, "Novo evento" do Google Agenda.

---

### Tarefa 11 — Visualizar / Editar / Concluir Quest

Abre quando o usuário clica num QuestCard. Pode ser um modal ou uma "tela" nova.

**Conteúdo:**
- Nome da quest
- Descrição editável → chama `updateQuest(id, { description: novoTexto })`
- Botão "Concluir Quest"

**A câmera — forma mais simples possível:**

```html
<input
  type="file"
  accept="image/*"
  capture="environment"
/>
```

`capture="environment"` abre a câmera traseira direto no mobile. Sem biblioteca. Funciona em iOS e Android.

**Converter a foto pra base64 (pra guardar no estado):**

```javascript
const handlePhoto = (e) => {
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onloadend = () => {
    completeQuest(quest.id, reader.result) // reader.result é a string base64
  }
  reader.readAsDataURL(file)
}
```

**Referência:** [MDN — FileReader](https://developer.mozilla.org/pt-BR/docs/Web/API/FileReader) | [MDN — input file](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input/file)

---

### Tarefa 12 — GalleryScreen

Mostra só as quests completas (`photo !== null`).

**Elementos:**
- Filtro Main / Side
- Grid com foto em destaque
- Quests sem foto aparecem também, mas por último

**Dica pra ordenar (foto primeiro):**

```javascript
const sorted = completed.sort((a, b) => {
  if (a.photo && !b.photo) return -1
  if (!a.photo && b.photo) return 1
  return 0
})
```

---

## FASE 5 — Persistência

### Tarefa 13 — localStorage

Sem isso, ao recarregar o app as quests somem.

**Dois momentos no Context:**

```javascript
// 1. Carregar ao iniciar (função no useState)
const [quests, setQuests] = useState(() => {
  const saved = localStorage.getItem('sheikah-quests')
  return saved ? JSON.parse(saved) : []
})

// 2. Salvar sempre que o array mudar
useEffect(() => {
  localStorage.setItem('sheikah-quests', JSON.stringify(quests))
}, [quests])
```

**Referência:** [MDN — localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)

**Exemplo do mundo real:** O Notion salva rascunhos localmente. O Google Maps salva histórico de buscas. Tudo localStorage.

---

## FASE 6 — Visual Sheikah

### Tarefa 14 — CSS

Aplica a estética do `ref/botw_mobile_template.html` nos componentes.

**O que extrair da referência:**
- Variáveis de cor no `:root` (paleta azul/cyan Sheikah)
- Fontes Cinzel + Rajdhani (já importadas no `sheikah.css`)
- Grid background com SVG
- Scanline overlay
- Bordas e cantos decorativos
- Animação do Sheikah Eye → SplashScreen

**Dica:** Pesquisa "CSS Modules Vite React" — evita conflito de nomes de classe entre componentes. Cada componente tem seu `.module.css`.

---

## Checklist de Entrega

```
[ ] Tarefa 1  — Renomear QuestContext
[ ] Tarefa 2  — Limpar App.jsx / App.css
[ ] Tarefa 3  — QuestContext (CRUD + Provider + hook)
[ ] Tarefa 4  — App.jsx (navegação)
[ ] Tarefa 5  — SplashScreen
[ ] Tarefa 6  — TopBar
[ ] Tarefa 7  — BottomNav
[ ] Tarefa 8  — HomeScreen (mock data)
[ ] Tarefa 9  — QuestCard
[ ] Tarefa 10 — Modal de Criar Quest
[ ] Tarefa 11 — Visualizar / Editar / Concluir + Câmera
[ ] Tarefa 12 — GalleryScreen
[ ] Tarefa 13 — localStorage
[ ] Tarefa 14 — CSS Sheikah
```
