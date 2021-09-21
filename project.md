# Desafio 02.1 - Criando um hook de carrinho de compras
// Solução: https://www.youtube.com/watch?v=NTeUIfUtKWw

// tags: #JsonServer# #FakeApi# #LocalStorageApi# #toastify# #React#
#TypeScript# #StyledComponents# #Axios# #React-Toastify#

# Projeto - addShop

# 💻 Sobre o desafio

Nesse desafio, você deverá criar uma aplicação para treinar o que aprendeu até agora no ReactJS

Essa será uma aplicação onde o seu principal objetivo é criar um hook de carrinho de compras. Você terá acesso a duas páginas, um componente e um hook para implementar as funcionalidades pedidas nesse desafio:

* **Funcionalidades**
- Adicionar um novo produto ao carrinho;
- Remover um produto do carrinho;
- Alterar a quantidade de um produto no carrinho;
- Cálculo dos preços sub-total e total do carrinho;
- Validação de estoque;
- Exibição de mensagens de erro;
- Entre outros.

A seguir veremos com mais detalhes o que e como precisa ser feito 🚀

## Template da aplicação

Para te ajudar nesse desafio, criamos para você esse modelo que você deve utilizar como um template do GitHub.

O template está disponível na seguinte URL: 

[GitHub - rocketseat-education/ignite-template-reactjs-criando-um-hook-de-carrinho-de-compras](https://github.com/rocketseat-education/ignite-template-reactjs-criando-um-hook-de-carrinho-de-compras)

**Dica**: Caso não saiba utilizar repositórios do GitHub como template, temos um guia em **[nosso FAQ](https://www.notion.so/FAQ-Desafios-ddd8fcdf2339436a816a0d9e45767664).**

## Se preparando para o desafio

Para esse desafio, além dos conceitos vistos em aula utilizaremos algumas coisa novas para deixar a nossa aplicação ainda melhor. Por isso, antes de ir diretamente para o código do desafio, explicaremos um pouquinho de:

- Fake API com JSON Server;
- Preservar dados do carrinho com localStorage API;
- Mostrar erros com toastify.

### Fake API com JSON Server

Assim como utilizamos o MirageJS no módulo 2 para simular uma API com os dados das transações da aplicação dtmoney, vamos utilizar o JSON Server para simular uma API que possui as informações dos produtos e do estoque. 

Navegue até a pasta criada, abra no Visual Studio Code e execute os seguintes comandos no terminal:

```bash
yarn
yarn server
```

Em seguida, você vai ver a mensagem:

  dShop_React$ yarn server
  yarn run v1.22.5
  $ json-server server.json -p 3333

    \{^_^}/ hi!

    Loading server.json
    Done

    Resources
    http://localhost:3333/stock
    http://localhost:3333/products

    Home
    http://localhost:3333

Perceba que ele iniciou uma fake API com os recursos `/stock` e `/products` em `localhost` na porta `3333` a partir das informações do arquivo [server.json](https://github.com/rocketseat-education/ignite-template-reactjs-criando-um-hook-de-carrinho-de-compras/blob/master/server.json) localizado na raiz do seu projeto. 

Acessando essas rotas no seu navegador, você consegue ver o retorno das informações já em JSON:
![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0fe33995-e128-480c-aaf9-c8d77e0f5544/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0fe33995-e128-480c-aaf9-c8d77e0f5544/Untitled.png)
![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c89f74cb-4e41-4658-91d4-f8358a973088/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c89f74cb-4e41-4658-91d4-f8358a973088/Untitled.png)

Para acessar a listagem de todos os produtos e estoque, basta realizar uma requisição GET nas rotas `/products` e `/stock` respectivamente. Para acessar os dados de um único item utilize os `route params`, exemplo: `/products/1` e `/stock/1` para acessar os dados do produto e estoque do produto de id 1, respectivamente.

Dessa forma, basta consumir essas rotas da API normalmente com o axios. Caso queira estudar mais sobre o **JSON Server**, dê uma olhada aqui:

[typicode/json-server](https://github.com/typicode/json-server)

### Preservando carrinho com localStorage API 
// #LocalStorageApi#

Para preservar os dados do carrinho mesmo se fecharmos a aplicação, utilizaremos a **localStorage API**

Essa é uma API que nos permite persistir dados no navegador em um esquema de chave-valor (semelhante ao que temos com objetos JSON). Como essa é uma API global, você não precisa importar nada antes de usar. 

Para salvar os dados, você deve utilizar o método `setItem`. Como primeiro argumento você deve informar o nome que você quer dar para o registro, no caso desse desafio é `obrigatório` utilizar o nome `@RocketShoes:cart`. Já o segundo argumento é o valor do registro que **obrigatoriamente** precisa estar no formato `string`.  Abaixo segue um exemplo:

```bash
localStorage.setItem('@RocketShoes:cart', cart)
```

Caso queira enviar um valor para o registro que não esteja no formato `string`, é preciso tratá-lo (ex.: `JSON.stringify`). Isso fará com que um objeto, lista, número ou qualquer outro valor seja convertido para uma string.

Para recuperar os dados, você deve utilizar o método `getItem` passando como argumento do registro que, no caso desse desafio, é `obrigatório` utilizar como `@RocketShoes:cart`. Abaixo segue um exemplo:

```jsx
const storagedCart = localStorage.getItem('@RocketShoes:cart');
```

O valor retornado pelo método `getItem` é sempre no formato `string`. Caso você queira utilizar esse dado em outro formato, é preciso tratá-los (ex.: `JSON.parse`). Isso irá converter a informação ao estado original de quando foi salva com o `JSON.strigify`, seja uma lista, um objeto ou outro tipo de dado.

Caso queira estudar mais sobre a **localStorage API**, dê uma olhada aqui

[Window.localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)

### Mostrando erros com toastify
// #toastify#

Para mostrar os erros em tela, iremos utilizar um pacote chamado **react-toastify**. Ela ajuda a mostra informações temporárias e rápidas de uma forma bem bonita.

De todos os métodos, utilizaremos apenas o `error` e será obrigatório utilizar mensagens predefinidas para que os testes passem (veremos mais sobre isso)

Caso queira estudar mais sobre a **react-toastify**, dê uma olhada aqui

[fkhadra/react-toastify](https://github.com/fkhadra/react-toastify#readme)

## O que devo editar na aplicação?

Com o template já clonado, as depêndencias instaladas e a [fake API rodando](https://www.notion.so/Desafio-01-Criando-um-hook-de-carrinho-de-compras-5769216778794019a83f544e79167b12), você deve completar onde não possui código com o código para atingir os objetivos de cada teste. Os documentos que devem ser editados são:

- [src/components/Header/index.tsx](https://github.com/rocketseat-education/ignite-template-reactjs-criando-um-hook-de-carrinho-de-compras/blob/main/src/components/Header/index.tsx);
- [src/pages/Home/index.tsx](https://github.com/rocketseat-education/ignite-template-reactjs-criando-um-hook-de-carrinho-de-compras/blob/main/src/pages/Home/index.tsx)
- [src/pages/Cart/index.tsx](https://github.com/rocketseat-education/ignite-template-reactjs-criando-um-hook-de-carrinho-de-compras/blob/main/src/pages/Cart/index.tsx);
- [src/hooks/useCart.tsx](https://github.com/rocketseat-education/ignite-template-reactjs-criando-um-hook-de-carrinho-de-compras/blob/main/src/hooks/useCart.tsx).

### components/Header/index.tsx

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/71a7f217-c1bb-426a-8fcc-dfb65db6bb7a/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/71a7f217-c1bb-426a-8fcc-dfb65db6bb7a/Untitled.png)

Você deve receber o array `cart` do hook `useCart` e mostrar em tela a quantidade de produtos **distintos** adicionados ao carrinho. Dessa forma, se o carrinho possui 4 unidades do item A e 1 unidade do item B o valor a ser mostrado é `2 itens`.

### pages/Home/index.tsx

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3d320e3c-a052-4f72-994e-aa69617ee85c/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3d320e3c-a052-4f72-994e-aa69617ee85c/Untitled.png)

Você deve renderizar os produtos buscados da fake API em tela com as informações de título, imagem, preço e quantidade adicionada ao carrinho. Por fim, é preciso implementar a funcionalidade de adicionar o produto escolhido ao carrinho ao clicar no botão `ADICIONAR AO CARRINHO`.

Nesse arquivo, temos três pontos importantes a serem implementados:

- **cartItemsAmount:** Deve possuir as informações da quantidade de cada produto no carrinho. Sugerimos criar um objeto utilizando `reduce` onde a chave representa o id do produto e o valor a quantidade do produto no carrinho. Exemplo: se você possuir no carrinho um produto de id 1 e quantidade 4 e outro produto de id 2 e quantidade 3, o objeto ficaria assim:

```jsx
{
	1: 4,
	2: 3
}
```

- **loadProducts:** Deve buscar os produtos da Fake API e formatar o preço utilizando o helper `utils/format`
- **handleAddProduct:** Deve adicionar o produto escolhido ao carrinho.

### pages/Cart/index.tsx

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a34120df-4046-4a84-8133-6eb987bceac6/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a34120df-4046-4a84-8133-6eb987bceac6/Untitled.png)

Você deve renderizar uma tabela com a imagem, título, preço unitário, quantidade de unidades e preço subtotal de cada produto no carrinho. Além disso, também é preciso renderizar o preço total do carrinho. Por fim, é preciso implementar as funcionalidades dos botões de decrementar, incrementar e remover o produto do carinho.

Nesse arquivo, temos cinco pontos importantes a serem implementados:

- **cartFormatted:** Deve formatar o carrinho adicionando os campos `priceFormatted` (preço do produto) e `subTotal` (preço do produto multiplicado pela quantidade) ambos devidamente formatados com o `utils/format`.
- **total:** Deve possuir a informação do valor total do carrinho devidamente formatado com o `utils/format`.
- **handleProductIncrement:** Deve aumentar em 1 unidade a quantidade do produto escolhido ao carrinho.
- **handleProductDecrement:** Deve diminuir em 1 unidade a quantidade do produto escolhido ao carrinho, onde o valor mínimo é 1 (nesse caso o botão deve estar desativado).
- **handleRemoveProduct:** Deve remover o produto escolhido do carrinho.

### hooks/useCart.tsx

Apesar de não retornar diretamente nenhuma renderização de elementos na interface como os outros arquivos, esse é o coração do desafio. Ele é responsável por:

- hook `useCart`;
- context `CartProvider`;
- manipular `localStorage`;
- exibir `toasts`.

Então é aqui que você vai implementar as funcionalidades que serão utilizadas pelo restante do app. Os principais pontos são:

- **cart:** Deve verificar se existe algum registro com o valor `@RocketShoes:cart` e retornar esse valor caso existir. Caso contrário, retornar um array vazio.
- **addProduct:** Deve adicionar um produto ao carrinho. Porém, é preciso verificar algumas coisas:
    - O valor atualizado do carrinho deve ser perpetuado no **localStorage** utilizando o método `setItem`.
    - Caso o produto já exista no carrinho, não se deve adicionar um novo produto repetido, apenas incrementar em 1 unidade a quantidade;
    - Verificar se existe no estoque a quantidade desejada do produto. Caso contrário, utilizar o método `error` da **react-toastify** com a seguinte mensagem:

    ```jsx
    toast.error('Quantidade solicitada fora de estoque');
    ```

    - Capturar utilizando `trycatch` os erros que ocorrerem ao longo do método e, no catch, utilizar o método `error` da **react-toastify** com a seguinte mensagem:

    ```jsx
    toast.error('Erro na adição do produto');
    ```

- **removeProduct:** Deve remover um produto do carrinho. Porém, é preciso verificar algumas coisas:
    - O valor atualizado do carrinho deve ser perpetuado no **localStorage** utilizando o método `setItem`.
    - Capturar utilizando `trycatch` os erros que ocorrerem ao longo do método e, no catch, utilizar o método `error` da **react-toastify** com a seguinte mensagem:

    ```jsx
    toast.error('Erro na remoção do produto');
    ```

- **updateProductAmount:** Deve atualizar a quantidade de um produto no carrinho. Porém, é preciso verificar algumas coisas:
    - O valor atualizado do carrinho deve ser perpetuado no **localStorage** utilizando o método `setItem`.
    - Se a quantidade do produto for menor ou igual a zero, sair da função **updateProductAmount** instantaneamente.
    - Verificar se existe no estoque a quantidade desejada do produto. Caso contrário, utilizar o método `error` da **react-toastify** com a seguinte mensagem:

    ```jsx
    toast.error('Quantidade solicitada fora de estoque');
    ```

    - Capturar utilizando `trycatch` os erros que ocorrerem ao longo do método e, no catch, utilizar o método `error` da **react-toastify** com a seguinte mensagem:

    ```jsx
    toast.error('Erro na alteração de quantidade do produto');
    ```

## Especificação dos testes

Em cada teste, tem uma breve descrição no que sua aplicação deve cumprir para que o teste passe.

Caso você tenha dúvidas quanto ao que são os testes, e como interpretá-los, dê uma olhada em **[nosso FAQ](https://www.notion.so/FAQ-Desafios-ddd8fcdf2339436a816a0d9e45767664)**

Para esse desafio, temos os seguintes testes:


* 1. **Teste components/Header/index.tsx**
[Teste components/Header/index.tsx](https://www.notion.so/Teste-components-Header-index-tsx-4c2e827e1b1246e9bbb4c63e6c4e7972)

- **should be able to render the amount of products added to cart**

Para que esse teste passe você deve renderizar o valor correto da quantidade de **tipos** de produtos 

```jsx
[
	{
	  amount: 2,
	  id: 1,
	  image:
	    'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
	  price: 179.9,
	  title: 'Tênis de Caminhada Leve Confortável',
	},
	{
	  amount: 1,
	  id: 2,
	  image:
	    'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
	  price: 139.9,
	  title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
	},
]
```

O valor correto a ser exibido é `2 itens`.

* 2. **Testes pages/Home/index.tsx**
[Testes pages/Home/index.tsx](https://www.notion.so/Testes-pages-Home-index-tsx-8c9b60a771684f60baf9b9c4de5aa8a9)

- **should be able to render each product quantity added to cart**

    Para que esse teste passe você deve renderizar corretamente a quantidade adicionada de cada produto adicionado ao carrinho dentro da tag `<div data-testid="cart-product-quantity">`. Sugerimos criar uma variável `cartItemsAmount` utilizando o método `reduce` para iterar sobre os produtos adicionados ao `cart` e gerar um array com o `

    Sugerimos criar uma variável `cartItemsAmount` utilizando o método `reduce` para iterar sobre os produtos adicionados ao `cart` e gerar um array com o `id` do produto e a quantidade adicionada ao carrinho. Exemplo:

    ```jsx
    [
    	0: 0,
    	1: 2,
    	2: 4
    ]
    ```

    Mostraria a quantidade 0 para o produto de `id` 1, 2 para o de `id e 4 para o último.

- **should be able to add a product to cart**

    Para que esse teste passe você deve clicar no botão `ADICIONAR AO CARRINHO` e o produto escolhido ser adicionado com sucesso ao carrinho. Além disso, a quantidade do produto no carrinho mostrada no botão deve representar o novo valor (incrementado de 1 unidade).

* 3. **Testes pages/Cart/index.tsx**
[Testes pages/Cart/index.tsx](https://www.notion.so/Testes-pages-Cart-index-tsx-20a8e0aa574b4a8a8a8a6462bc769094)

- **should be able to increase/decrease a product amount**

    Para que esse teste passe você deve renderizar corretamente o valor da quantidade de cada produto adicionado ao carrinho e ser capaz de incrementar e decrementar os valores ao clicar

    no botões `<button *data-testid*="increment-product">` e `<button *data-testid*="decrement-product">` respect

- **should not be able to decrease a product amount when value is 1**

    Para que esse teste passe você deve desabilitar o botão `<button*data-testid*="decrement-product">` quando a quantidade do produto for igual a 1.

- **shoud be able to remove a product**

    Para que esse teste passe você deve ser capaz de remover o produto do carrinho ao clicar no botão `<button*data-testid*="remove-product">`

* 4. **Testes hooks/useCart.tsx**
[Testes hooks/useCart.tsx](https://www.notion.so/Testes-hooks-useCart-tsx-ee1a6dd59bf74599aa8cc518bcda4a17)

- **should be able to initialize cart with localStorage value**

    Para que esse teste passe você deve inicializar o estado `cart` com o valor da key `@RocketShoes:cart` do localStorage caso ele exista.

- **should be able to add a new product**

    Para que esse teste passe você deve utilizar a função `addProduct` para adicionar um novo produto ao carrinho e preservar o valor atualizado do carrinho no localStorage utilizando o `setItem`.

- **should not be able add a product that does not exist**

    Para que esse teste passe você deve utilizar a função `addProduct` para verificar que o produto não existe, mostrar um `toast.error` com a mensagem `Erro na adição do produto` e sair da função sem alterar o `cart` e o valor no localStorage.

- **should be able to increase a product amount when adding a product that already exists on cart**

    Para que esse teste passe você deve utilizar a função `addProduct` para incrementar em 1 unidade a quantidade de um produto no carrinho em vez de adicionar um novo produto. Deve também preservar o valor atualizado do carrinho no localStorage utilizando o `setItem`.

- **should not be able to increase a product amount when running out of stock**

    Para que esse teste passe você deve utilizar a função `addProduct` para verificar que a quantidade desejada do produto não possui em estoque (rota `stock/id` da Fake API). Deve também mostrar um `toast.error` com a mensagem `Quantidade solicitada fora de estoque` e sair da função sem alterar o `cart` e o valor no localStorage.

- **should be able to remove a product**

    Para que esse teste passe você deve utilizar a função `removeProduct` para remover um produto do carrinho. Deve também preservar o valor atualizado do carrinho no localStorage utilizando o `setItem`.

- **should not be able to remove a product that does not exist**

    Para que esse teste passe você deve utilizar a função `removeProduct` para verificar que o produto não existe no carrinho e mostrar um `toast.error` com a mensagem `Erro na remoção do produto`. Deve também sair da função sem alterar o `cart` e o valor no localStorage.

- **should be able to update a product amount**

    Para que esse teste passe você deve utilizar a função `updateProductAmount` para incrementar e decrementar o valor de um produto no carrinho. Deve também preservar o valor atualizado do carrinho no localStorage utilizando o `setItem`.

- **should not be able to update a product that does not exist**

    Para que esse teste passe você deve utilizar a função `updateProductAmount` para verificar que o produto não existe e mostrar um `toast.error` com a mensagem `Erro na alteração de quantidade do produto`. Deve também sair da função sem alterar o `cart` e o valor no localStorage.

- **should not be able to update a product amount when running out of stock**

    Para que esse teste passe você deve utilizar a função `updateProductAmount` para verificar que a quantidade desejada do produto não possui em estoque (rota `stock/id` da Fake API). Deve também mostrar um `toast.error` com a mensagem `Quantidade solicitada fora de estoque` e sair da função sem alterar o `cart` e o valor no localStorage.

- **should not be able to update a product amount to a value smaller than 1**

    Para que esse teste passe você deve utilizar a função `updateProductAmount` para verificar que a quantidade desejada do produto é menor que 1 e sair imediatamente da função sem alterar o `cart` e o valor no localStorage.

## Como deve ficar a aplicação ao final?

Está com dúvidas (ou curioso 👀) para ver como deve ficar a aplicação ao final do desafio? Deixamos abaixo um vídeo mostrando as principais funcionalidades que você deve implementar para te ajudar (ou matar sua curiosidade 👀).

[https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f166455c-a42f-4d25-8baa-a6686a3cb476/challenge.mp4](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f166455c-a42f-4d25-8baa-a6686a3cb476/challenge.mp4)

# 📅 Entrega

Esse desafio deve ser entregue a partir da plataforma da Rocketseat. Envie o link do repositório que você fez suas alterações. Após concluir o desafio, além de ter mandado o código para o GitHub, fazer um post no Linkedin é uma boa forma de demonstrar seus conhecimentos e esforços para evoluir na sua carreira para oportunidades futuras.

# Solução do desafio

Caso você queira ver como resolver o desafio, fizemos um vídeo explicando o passo a passo para cumprir com todos os requisitos da aplicação:

[https://youtu.be/NTeUIfUtKWw](https://youtu.be/NTeUIfUtKWw)

# Rodando todos os teste de todos os arquivos
    > yarn test

# Rodando todos os teste de um arquivo
    > yarn test src/__tests__/components/Header.spec.tsx

# Rodando teste por teste
    > yarn test -t 'should be able to initialize cart with localStorage value'