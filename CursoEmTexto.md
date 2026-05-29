# Sheikah Slate — Curso em Texto

## Antes de começar

Toda vez que você for ver suas mudanças no navegador, rode dentro da pasta `sheikahcode/vite-project/`:

```
npm run dev
```

Deixa esse terminal rodando enquanto trabalha. O Vite atualiza a tela automaticamente a cada save.

---

## Aula 1 — Renomeando o Context (Tarefa 1)

### Por que isso importa?

No JavaScript/React, importar um arquivo com nome errado é um erro silencioso esperando pra acontecer. `QuestContest` não existe como conceito — é um typo de `QuestContext`. Quanto antes corrigir, menos confusão depois.

### Passo a passo

**No explorador de arquivos do VSCode**, clique com o botão direito em:

```
src/context/QuestContest.jsx
```

Selecione **Rename** e mude para `QuestContext.jsx`.

> O VSCode às vezes pergunta se quer atualizar os imports automaticamente — aceite se oferecer. Se não oferecer, verifique manualmente se algum arquivo importa o nome antigo.

**Como verificar:** Use Ctrl+Shift+F (busca global) e pesquise por `QuestContest`. Se não aparecer nada, está limpo.

### Como saber que terminou

O arquivo se chama `QuestContext.jsx` e nenhum outro arquivo importa o nome antigo.

---

## Aula 2 — Limpando o App.jsx (Tarefa 2)

### Por que isso importa?

O `App.jsx` que o Vite gerou é uma demonstração — ele existe pra mostrar que o projeto funciona. Você não vai usar nada daquilo. Deixar código que não serve no projeto é ruído: confunde, polui, e às vezes conflita com o que você vai criar.

### Conceito: o componente raiz

Em React, todo app começa num único componente raiz. Ele é o "ponto de entrada" visual do app — o pai de tudo. No seu projeto, esse papel é do `App.jsx`.

**Exemplo do mundo real:** Pensa no App como o container principal do YouTube. Ele não é o vídeo, não é a barra de pesquisa, não é o menu lateral. Ele é o que contém e organiza tudo isso.

### Passo a passo

**No arquivo `src/App.jsx`**, apague todo o conteúdo e deixe só a casca:

```jsx
function App() {
  return (
    <div>
    </div>
  )
}

export default App
```

**No arquivo `src/App.css`**, apague todo o conteúdo. Deixe o arquivo vazio por enquanto.

> Não apague o `index.css` nem o `sheikah.css` — eles têm configurações globais que você vai aproveitar.

### Como saber que terminou

O navegador mostra uma página em branco sem erros no console.

---

## Aula 3 — Construindo o QuestContext (Tarefa 3)

Esta é a aula mais importante do projeto. Reserve tempo para ela.

### O problema que o Context resolve

Imagina que o array de quests vive no `App.jsx`. Para chegar até o `QuestCard` lá no fundo da árvore, ele teria que passar por cada camada como se fosse um telefone sem fio:

```
App → HomeScreen → QuestList → QuestCard
```

Cada componente no meio repassa o dado mesmo sem usar. Isso se chama **prop drilling** e vira um pesadelo em apps maiores.

**Exemplo do mundo real:** É como se, para você pagar um pedido no iFood, o app precisasse passar o valor do carrinho pela tela de endereço, pela tela de cupom, pela tela de avaliação anterior... só pra chegar no botão de pagamento. Não faz sentido. O carrinho fica num lugar centralizado e qualquer tela acessa direto.

### O que é o Context?

Context é uma variável global controlada. Você:
1. Cria o "container" com `createContext()`
2. Envolve o app com um `Provider` que injeta o dado
3. Qualquer componente acessa com `useContext()`

### Conceito: o Provider Pattern

O `Provider` funciona como um **transmissor de rádio**. Ele emite os dados numa "frequência". Qualquer componente que quiser "sintonizar" nessa frequência usa `useContext()` para receber o sinal.

### Passo a passo

**No arquivo `src/context/QuestContext.jsx`**, você vai construir três coisas:

**1. O contexto em si:**
```jsx
import { createContext, useContext, useState } from 'react'

const QuestContext = createContext()
```

`createContext()` cria o container vazio. Por enquanto não tem dado nenhum — isso vem no Provider.

---

**2. O Provider — o componente que injeta os dados:**

```jsx
export function QuestProvider({ children }) {
  const [quests, setQuests] = useState([])

  function addQuest(data) {
    // Crie um objeto novo com:
    // - id gerado por crypto.randomUUID()
    // - os campos de `data` espalhados com spread operator (...)
    // - photo: null (toda quest começa incompleta)
    // Adicione ao array com setQuests(prev => [...prev, novaQuest])
  }

  function updateQuest(id, changes) {
    // Use .map() no array de quests
    // Para cada quest: se quest.id === id, retorne { ...quest, ...changes }
    // Caso contrário, retorne a quest sem alterar
  }

  function completeQuest(id, photo) {
    // Dica: você já tem updateQuest. O que você passaria como `changes`?
  }

  function deleteQuest(id) {
    // Use .filter() para retornar só as quests cujo id é diferente do id recebido
  }

  const value = { quests, addQuest, updateQuest, completeQuest, deleteQuest }

  return (
    <QuestContext.Provider value={value}>
      {children}
    </QuestContext.Provider>
  )
}
```

O `{children}` é tudo que estiver dentro do Provider quando ele for usado no App. Pensa no Provider como um `<div>` invisível — ele envolve os filhos e injeta os dados.

---

**3. O hook customizado:**

```jsx
export function useQuests() {
  return useContext(QuestContext)
}
```

Por que criar isso ao invés de usar `useContext` diretamente? Dois motivos:

- **Conveniência:** `useQuests()` é mais legível que `useContext(QuestContext)` em todo lugar
- **Proteção:** Você pode adicionar um aviso se alguém tentar usar o hook fora do Provider

**Exemplo do mundo real:** O React Router tem um hook `useNavigate()` que funciona exatamente assim — é um wrapper de `useContext` que expõe a função de navegação de qualquer lugar do app.

### Conceito: spread operator `...`

O `...` (spread) "espalha" as propriedades de um objeto dentro de outro:

```javascript
const base = { name: 'Link', type: 'main' }
const completo = { ...base, photo: null }
// resultado: { name: 'Link', type: 'main', photo: null }
```

Você vai usar isso bastante: no `addQuest` pra montar a quest nova, e no `updateQuest` pra aplicar as mudanças sem sobrescrever o objeto inteiro.

### Conceito: funções de array `.map()` e `.filter()`

**`.map()`** — transforma cada item e retorna um array novo de mesmo tamanho:
```javascript
[1, 2, 3].map(n => n * 2)  // [2, 4, 6]
```

**`.filter()`** — retorna só os itens que passam no teste:
```javascript
[1, 2, 3, 4].filter(n => n > 2)  // [3, 4]
```

**Importante:** Nenhum dos dois muda o array original. Eles retornam arrays novos. Isso é fundamental em React — você nunca muta o estado diretamente, sempre cria um novo.

### Referências

- [MDN — Array.map()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [MDN — Array.filter()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [React Docs — createContext](https://react.dev/reference/react/createContext)

### Como saber que terminou

As quatro funções têm implementação. O arquivo exporta `QuestProvider` e `useQuests`. Nenhum erro no console ao importar.

---

## Aula 4 — Montando a Navegação no App.jsx (Tarefa 4)

### O que o App.jsx vai fazer

O App é o maestro do show. Ele:
1. Envolve tudo com `QuestProvider`
2. Sabe qual tela está ativa
3. Renderiza a tela certa
4. Renderiza TopBar e BottomNav (exceto na Splash)

### Conceito: renderização condicional

Em React, você pode renderizar componentes diferentes dependendo de uma condição:

```jsx
{currentScreen === 'home' && <HomeScreen />}
```

O operador `&&` funciona assim: se o lado esquerdo for verdadeiro, renderiza o lado direito. Se for falso, não renderiza nada.

Outra forma com ternário:
```jsx
{currentScreen === 'home' ? <HomeScreen /> : <GalleryScreen />}
```

### Passo a passo

**No arquivo `src/App.jsx`**, construa a estrutura de navegação:

```jsx
import { useState } from 'react'
import { QuestProvider } from './context/QuestContext'
// importe os componentes de tela aqui (crie os imports mesmo que os componentes estejam vazios)

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash')

  return (
    <QuestProvider>
      {/* Renderize a SplashScreen passando uma prop onFinish */}
      {/* Quando currentScreen não for 'splash', mostre TopBar e BottomNav */}
      {/* Renderize HomeScreen ou GalleryScreen baseado no currentScreen */}
    </QuestProvider>
  )
}

export default App
```

**Sobre a SplashScreen:** ela recebe uma prop `onFinish` que é uma função. Quando a animação terminar, ela chama essa função. O App define o que acontece: `() => setCurrentScreen('home')`.

**Sobre o BottomNav:** ele precisa saber onde estamos e como mudar. Passe `currentScreen` e `onNavigate` como props.

### Exemplo do mundo real

O app do Instagram tem um estado central de "aba ativa". Quando você clica em Reels, esse estado muda pra `'reels'` e o app renderiza o componente de Reels no lugar do Feed. A tab bar apenas chama `setCurrentTab('reels')`.

### Como saber que terminou

O app renderiza sem erros. A Splash aparece inicialmente (mesmo que seja uma div vazia por enquanto).

---

## Aula 5 — SplashScreen com useEffect (Tarefa 5)

### O problema

Você quer que algo aconteça **depois** que o componente apareceu na tela — neste caso, um timer que troca de tela após alguns segundos. Mas o corpo do componente React roda durante o render, não depois. Como fazer algo que acontece no tempo certo?

### Conceito: useEffect

`useEffect` é o hook pra efeitos colaterais — coisas que acontecem fora do fluxo de render. Timers, chamadas de API, manipulação do DOM.

Ele recebe dois argumentos:
1. Uma função que contém o efeito
2. Um array de dependências que controla quando o efeito roda

```jsx
useEffect(() => {
  // seu código aqui
}, []) // [] = roda só uma vez, quando o componente aparece na tela
```

**Por que o array vazio?** Pensa assim: o array de dependências diz "rode esse efeito de novo quando qualquer uma dessas variáveis mudar". Se o array está vazio, não tem variável pra mudar, então roda só uma vez.

### Conceito: função de limpeza (cleanup)

Quando você cria um timer, ele fica rodando mesmo se o componente sair da tela. Isso causa memory leak. O `useEffect` permite que você retorne uma função de limpeza:

```jsx
useEffect(() => {
  const timer = setTimeout(...)
  return () => clearTimeout(timer) // roda quando o componente sai da tela
}, [])
```

**Exemplo do mundo real:** A tela de splash do Spotify, Netflix, Google — aparece na abertura do app, conta alguns segundos (às vezes esperando dados carregarem), e transiciona pra tela principal. Todas usam um mecanismo parecido com esse.

### Passo a passo

**No arquivo `src/components/SplashScreen/SplashScreen.jsx`**:

```jsx
import { useEffect } from 'react'

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    // crie um setTimeout que chame onFinish após 3000ms
    // retorne uma função que cancele o timer (clearTimeout)
  }, [])

  return (
    <div>
      {/* por enquanto pode ser só um texto "Sheikah Slate" */}
      {/* o visual bonito vem na Tarefa 14 */}
    </div>
  )
}
```

### Referências

- [React Docs — useEffect](https://react.dev/reference/react/useEffect)
- [MDN — setTimeout](https://developer.mozilla.org/pt-BR/docs/Web/API/setTimeout)

### Como saber que terminou

App abre, mostra a SplashScreen, espera ~3 segundos, troca pra HomeScreen automaticamente.

---

## Aula 6 — TopBar (Tarefa 6)

### O que é

Um componente simples. Recebe `title` como prop e renderiza no topo da tela.

### Passo a passo

**No arquivo `src/components/TopBar/TopBar.jsx`**:

```jsx
export default function TopBar({ title }) {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  )
}
```

**De volta no `src/App.jsx`**, passe o título correto dependendo da tela ativa:

```jsx
const titles = {
  home: 'Sheikah Slate',
  gallery: 'Galeria'
}

// <TopBar title={titles[currentScreen]} />
```

### Como saber que terminou

TopBar aparece com o título certo em cada tela.

---

## Aula 7 — BottomNav (Tarefa 7)

### O que é

A barra de navegação inferior. Dois botões: Home e Gallery. Destaca o botão da tela ativa. Não aparece na Splash.

### Passo a passo

**No arquivo `src/components/BottomNav/BottomNav.jsx`**:

```jsx
export default function BottomNav({ currentScreen, onNavigate }) {
  return (
    <nav>
      <button
        onClick={() => onNavigate('home')}
      >
        Home
      </button>
      <button
        onClick={() => onNavigate('gallery')}
      >
        Galeria
      </button>
    </nav>
  )
}
```

Para destacar o botão ativo, adicione uma classe CSS condicionalmente:

```jsx
className={currentScreen === 'home' ? 'active' : ''}
```

**Exemplo do mundo real:** Tab bar do WhatsApp — o ícone da aba ativa fica com uma cor diferente. É exatamente isso: uma classe CSS condicional baseada num estado.

### Como saber que terminou

Clicar nos botões troca a tela. O botão da tela atual aparece diferente visualmente.

---

## Aula 8 — HomeScreen com Mock Data (Tarefa 8)

### A estratégia do mock data

Antes de conectar o Context, você vai construir a tela com dados **falsos hardcoded**. Isso te permite:
- Ver o visual funcionando imediatamente
- Não depender de outras partes do app ainda prontas
- Iterar rápido

Quando a tela estiver boa, você troca o mock pelo `useQuests()`.

### Passo a passo

**No arquivo `src/components/HomeScreen/HomeScreen.jsx`**:

**Passo 1:** Crie um array de mock data com 3-4 quests usando a estrutura que você definiu:

```jsx
const mockQuests = [
  {
    id: '1',
    title: 'Explorar o Labirinto',
    type: 'main',
    description: 'Chegar ao centro...',
    photo: null
  },
  {
    id: '2',
    title: 'Coletar ervas',
    type: 'side',
    description: 'Encontrar 5 ervas...',
    photo: 'foto-existe' // simulando uma quest completa
  },
  // adicione mais uma ou duas
]
```

**Passo 2:** Crie um estado para o filtro ativo:

```jsx
const [filter, setFilter] = useState('all') // 'all' | 'main' | 'side'
```

**Passo 3:** Filtre as quests baseado no filtro ativo:

```jsx
const questsToShow = filter === 'all'
  ? mockQuests
  : mockQuests.filter(q => q.type === filter)
```

**Passo 4:** Renderize:
- 3 botões de filtro (Todas / Main / Side)
- A lista de `<QuestCard />` usando `.map()`
- Um botão de "+" para adicionar nova quest

**Dica para o `.map()`:**

```jsx
{questsToShow.map(quest => (
  <QuestCard key={quest.id} quest={quest} />
))}
```

> O `key` é obrigatório quando você usa `.map()` pra gerar uma lista de componentes. Ele ajuda o React a identificar qual item mudou quando a lista é atualizada. Use sempre o `id` como key — nunca o índice do array.

### Referências

- [React Docs — Rendering Lists](https://react.dev/learn/rendering-lists)

### Como saber que terminou

A tela mostra as quests do mock. Os filtros funcionam. O botão "+" existe (sem abrir nada ainda).

---

## Aula 9 — QuestCard (Tarefa 9)

### O que é

O componente que representa uma quest na lista. Recebe um objeto `quest` e mostra as informações.

### Conceito: dados derivados no componente

Você não guardou `rupees` no objeto quest — você guarda `type` e calcula as rupees na hora. Isso acontece dentro do QuestCard:

```jsx
const rupees = quest.type === 'main' ? 50 : 25
```

Da mesma forma, saber se está completa:

```jsx
const isCompleted = quest.photo !== null
```

**Por que isso é bom?** Você tem uma única fonte de verdade (`type` e `photo`). Não tem como o número de rupees ficar desatualizado — ele é sempre calculado do zero a partir do `type`.

**Exemplo do mundo real:** O preço final de um produto no Mercado Livre não é guardado no banco de dados — é calculado na hora: `preço base - desconto + frete`. Se fosse guardado, teria que ser atualizado toda vez que qualquer componente mudasse, gerando inconsistências.

### Passo a passo

Crie o arquivo `src/components/QuestCard/QuestCard.jsx` (você vai precisar criar a pasta e o arquivo):

```jsx
export default function QuestCard({ quest, onClick }) {
  const rupees = // calcule aqui
  const isCompleted = // calcule aqui

  return (
    <div onClick={onClick}>
      <span>{quest.title}</span>
      <span>{quest.type === 'main' ? 'Main Quest' : 'Side Quest'}</span>
      <span>{rupees} ◆</span>
      {isCompleted && <span>✓ Completa</span>}
    </div>
  )
}
```

**De volta no `src/components/HomeScreen/HomeScreen.jsx`**, passe um `onClick` pro card. O clique vai abrir o modal de detalhes (que você vai criar na próxima aula):

```jsx
<QuestCard
  key={quest.id}
  quest={quest}
  onClick={() => setSelectedQuest(quest)}
/>
```

Isso significa que você vai precisar de um novo estado no HomeScreen:

```jsx
const [selectedQuest, setSelectedQuest] = useState(null)
```

### Como saber que terminou

Cada card mostra título, tipo, rupees e indicador de completo. Clicar num card guarda aquela quest no estado `selectedQuest`.

---

## Aula 10 — Modal de Criar Quest (Tarefa 10)

### Conceito: formulários controlados

Em React, inputs de formulário têm dois modos: **não-controlado** (o DOM guarda o valor) e **controlado** (o React guarda o valor). Você vai usar o controlado — cada campo tem um `useState` próprio.

Por que controlado? Porque você precisa do valor do campo no momento do submit, e quer poder validar/transformar o dado antes de salvar.

**Exemplo não-controlado (evite):**
```jsx
<input type="text" /> {/* o React não sabe o que tem aqui */}
```

**Exemplo controlado (use):**
```jsx
const [title, setTitle] = useState('')
<input value={title} onChange={e => setTitle(e.target.value)} />
```

**Exemplo do mundo real:** Qualquer formulário de cadastro — Google, Twitter, iFood. Quando você digita seu email e o app já mostra "email inválido" em tempo real, é porque o valor está num estado React sendo validado a cada tecla.

### Conceito: modal controlado por estado booleano

```jsx
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

// abrir: setIsCreateModalOpen(true)
// fechar: setIsCreateModalOpen(false)

{isCreateModalOpen && <CreateQuestModal onClose={() => setIsCreateModalOpen(false)} />}
```

### Passo a passo

Crie o arquivo `src/components/CreateQuestModal/CreateQuestModal.jsx`:

```jsx
import { useState } from 'react'
import { useQuests } from '../../context/QuestContext'

export default function CreateQuestModal({ onClose }) {
  const { addQuest } = useQuests()
  const [title, setTitle] = useState('')
  const [type, setType] = useState('main')
  const [description, setDescription] = useState('')

  function handleSubmit() {
    if (!title.trim()) return // não salva quest sem título

    addQuest({ title, type, description })
    onClose()
  }

  return (
    <div>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Nome da Quest"
      />

      {/* Dois botões para escolher Main ou Side */}
      {/* Dica: use onClick para chamar setType('main') ou setType('side') */}
      {/* Destaque o botão ativo com uma classe condicional */}

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Descreva a quest..."
      />

      <button onClick={handleSubmit}>Criar Quest</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  )
}
```

**De volta no `src/components/HomeScreen/HomeScreen.jsx`**, conecte o botão "+" ao estado do modal e renderize o modal condicionalmente.

### Referências

- [React Docs — Controlled Components](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)

### Como saber que terminou

Clicar no "+" abre o modal. Preencher e confirmar cria a quest (aparece na lista). Cancelar fecha sem salvar.

---

## Aula 11 — Visualizar, Editar e Concluir Quest (Tarefa 11)

### O que esta tela faz

Quando o usuário clica num QuestCard, abre um modal com:
- O nome da quest (só leitura)
- A descrição (editável)
- O botão "Concluir Quest" (abre a câmera)

### Passo a passo — Visualizar e Editar

Crie o arquivo `src/components/QuestDetailModal/QuestDetailModal.jsx`:

```jsx
import { useState } from 'react'
import { useQuests } from '../../context/QuestContext'

export default function QuestDetailModal({ quest, onClose }) {
  const { updateQuest, completeQuest } = useQuests()
  const [description, setDescription] = useState(quest.description)

  function handleSave() {
    updateQuest(quest.id, { description })
  }

  return (
    <div>
      <h2>{quest.title}</h2>

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button onClick={handleSave}>Salvar descrição</button>

      {/* Botão de concluir — veja abaixo */}

      <button onClick={onClose}>Fechar</button>
    </div>
  )
}
```

**De volta no `src/components/HomeScreen/HomeScreen.jsx`**, renderize o modal quando `selectedQuest` não for null:

```jsx
{selectedQuest && (
  <QuestDetailModal
    quest={selectedQuest}
    onClose={() => setSelectedQuest(null)}
  />
)}
```

### Passo a passo — A câmera

Esta é a parte mais interessante. A forma mais simples de abrir a câmera no mobile é um `input` HTML nativo:

```html
<input type="file" accept="image/*" capture="environment" />
```

- `accept="image/*"` — aceita qualquer imagem
- `capture="environment"` — abre a câmera traseira direto (no mobile)
- No desktop, abre o seletor de arquivos normalmente

**O problema:** você precisa guardar a foto como texto (string) no seu estado, mas o input te dá um objeto `File`. A solução é converter pra **base64** usando a API `FileReader` do navegador.

**Conceito: base64** é uma forma de representar qualquer arquivo binário (imagem, pdf, etc.) como uma string de texto. É comum guardar imagens pequenas assim em localStorage ou banco de dados. O lado ruim é que base64 ocupa ~33% a mais de espaço que o arquivo original.

**Dentro do `QuestDetailModal`**, adicione o input de câmera e o handler:

```jsx
function handlePhoto(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.onloadend = () => {
    // reader.result é a string base64 da imagem
    completeQuest(quest.id, reader.result)
    onClose()
  }

  reader.readAsDataURL(file)
}

// No JSX:
{!quest.photo && (
  <label>
    Concluir Quest
    <input
      type="file"
      accept="image/*"
      capture="environment"
      onChange={handlePhoto}
      style={{ display: 'none' }}
    />
  </label>
)}
```

> O `<label>` envolvendo o `<input>` é um truque do HTML: clicar no label ativa o input. Assim você pode estilizar o label como um botão e esconder o input feio do navegador.

**Exemplo do mundo real:** WhatsApp Web — quando você clica no ícone de clipe e seleciona uma foto, internamente está usando `FileReader` para converter o arquivo em base64 antes de enviar.

### Referências

- [MDN — FileReader](https://developer.mozilla.org/pt-BR/docs/Web/API/FileReader)
- [MDN — input type=file](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input/file)

### Como saber que terminou

Clicar num card abre o modal. A descrição é editável e salva. O botão de concluir abre a câmera/seletor. Após tirar a foto, a quest fica marcada como completa.

---

## Aula 12 — GalleryScreen (Tarefa 12)

### O que é

Mostra as quests completas (`photo !== null`) em formato de galeria. Prioriza as que têm foto. Tem filtro Main / Side.

### Passo a passo

**No arquivo `src/components/GalleryScreen/GalleryScreen.jsx`**:

```jsx
import { useState } from 'react'
import { useQuests } from '../../context/QuestContext'

export default function GalleryScreen() {
  const { quests } = useQuests()
  const [filter, setFilter] = useState('all')

  // Passo 1: pegue só as quests completas
  const completedQuests = quests.filter(q => q.photo !== null)

  // Passo 2: aplique o filtro de tipo
  const filtered = filter === 'all'
    ? completedQuests
    : completedQuests.filter(q => q.type === filter)

  // Passo 3: ordene — quests com foto primeiro
  // (neste caso todas têm foto, mas se você mostrar incompletas também, use:)
  const sorted = [...filtered].sort((a, b) => {
    if (a.photo && !b.photo) return -1
    if (!a.photo && b.photo) return 1
    return 0
  })

  return (
    <div>
      {/* Botões de filtro */}

      {sorted.map(quest => (
        <div key={quest.id}>
          {quest.photo && <img src={quest.photo} alt={quest.title} />}
          <p>{quest.title}</p>
        </div>
      ))}
    </div>
  )
}
```

> `[...filtered]` cria uma cópia do array antes de ordenar. O `.sort()` muta o array original — em React você sempre trabalha com cópias.

### Como saber que terminou

GalleryScreen mostra as quests concluídas com a foto. Filtros de tipo funcionam.

---

## Aula 13 — localStorage: Salvando os dados (Tarefa 13)

### O problema

Toda vez que você recarregar o app, o `useState` começa do zero — array vazio. Para persistir os dados entre sessões, você vai usar o `localStorage`.

### O que é o localStorage

É um banco de dados simples do navegador. Guarda pares chave-valor, onde o valor é sempre uma string. Capacidade de ~5MB por domínio. Persiste entre sessões (não some ao fechar o browser).

**Como usar:**
```javascript
// Salvar
localStorage.setItem('chave', JSON.stringify(valor))

// Ler
const valor = JSON.parse(localStorage.getItem('chave'))

// Remover
localStorage.removeItem('chave')
```

**Exemplo do mundo real:** O Google Maps guarda seu histórico de pesquisas no localStorage. O Notion salva rascunhos localmente antes de sincronizar com o servidor. Dark mode de sites — é localStorage guardando sua preferência.

### Dois momentos de sincronização

**1. Ao iniciar:** Carregar os dados salvos como valor inicial do useState.

O `useState` aceita uma **função** como valor inicial (chamada de "lazy initializer"). Essa função roda só uma vez na montagem:

```javascript
const [quests, setQuests] = useState(() => {
  const saved = localStorage.getItem('sheikah-quests')
  return saved ? JSON.parse(saved) : []
})
```

Por que a função e não direto? Se você passasse `JSON.parse(localStorage.getItem(...))` direto, ele rodaria em todo render. Com a função, roda só uma vez.

**2. Ao mudar:** Salvar sempre que o array mudar.

```javascript
useEffect(() => {
  localStorage.setItem('sheikah-quests', JSON.stringify(quests))
}, [quests]) // [quests] = roda toda vez que o array mudar
```

### Passo a passo

**No arquivo `src/context/QuestContext.jsx`**:

1. Troque o `useState([])` pelo lazy initializer que lê do localStorage
2. Adicione o `useEffect` que salva quando `quests` muda
3. Importe `useEffect` do React no topo do arquivo (já que você vai usar)

### Referências

- [MDN — localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)

### Como saber que terminou

Crie algumas quests, recarregue o app (F5) — as quests continuam lá.

---

## Aula 14 — CSS Sheikah (Tarefa 14)

### A estratégia

Agora que tudo funciona, você vai aplicar a estética. O arquivo `ref/botw_mobile_template.html` tem tudo que você precisa — é uma referência visual completa.

### Conceito: CSS Modules

Em vez de um CSS global enorme, você pode criar um `.module.css` por componente. As classes ficam isoladas — sem risco de conflito entre componentes.

```
SplashScreen/
├── SplashScreen.jsx
└── SplashScreen.module.css
```

**Como usar:**

```jsx
// SplashScreen.jsx
import styles from './SplashScreen.module.css'

<div className={styles.container}>
```

```css
/* SplashScreen.module.css */
.container {
  background: #080f1c;
}
```

O Vite compila `.container` pra um nome único como `SplashScreen_container__abc123` — sem colisão com outros componentes.

**Referência:** [Vite — CSS Modules](https://vite.dev/guide/features#css-modules)

### O que extrair do arquivo de referência

Abra o `ref/botw_mobile_template.html` e procure por:

- **Variáveis CSS no `:root`** — a paleta de cores inteira (`#080f1c`, `#1e6fa8`, `#5cb8e8`, etc.)
- **`.sheikah-grid`** — background com grid de linhas
- **`.scanlines`** — overlay de scanlines (efeito CRT)
- **`.corner-overlay`** — cantos decorativos SVG
- **`@keyframes shimmer`** — animação do Sheikah Eye pra SplashScreen
- **`.shrine-pulse`** — animação de pulso

### Prioridade de aplicação

Comece pelo que tem maior impacto visual:
1. Background geral e paleta de cores (`:root` + `body`)
2. Container do app (360px centralizado, bordas arredondadas)
3. TopBar e BottomNav (são os mais visíveis)
4. Cards de quest
5. Modais
6. SplashScreen com animação

### Como saber que terminou

O app parece com a referência visual. Fontes Cinzel e Rajdhani aplicadas. Paleta de cores azul/cyan Sheikah. Animação na SplashScreen.

---

## Ordem de batalha

```
[ ] Aula 1  — Renomear QuestContext
[ ] Aula 2  — Limpar App.jsx / App.css
[ ] Aula 3  — QuestContext (CRUD + Provider + hook)
[ ] Aula 4  — App.jsx (navegação)
[ ] Aula 5  — SplashScreen
[ ] Aula 6  — TopBar
[ ] Aula 7  — BottomNav
[ ] Aula 8  — HomeScreen (mock data)
[ ] Aula 9  — QuestCard
[ ] Aula 10 — Modal de Criar Quest
[ ] Aula 11 — Visualizar / Editar / Concluir + Câmera
[ ] Aula 12 — GalleryScreen
[ ] Aula 13 — localStorage
[ ] Aula 14 — CSS Sheikah
```

---

**Quando travar:** Para, lê a mensagem de erro com calma, tenta entender o que ela está dizendo, e me chama com o erro e o que você tentou.
