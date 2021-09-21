// 99 => fazendo a automação da atualização da storage baseado em previousCard
// 98 => Atualização da LocalStorage em cada operação de ciclo de vida

import { createContext, ReactNode, useContext, useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

// interface para receber qualquer elemento que venha como children do provider
interface CartProviderProps {
  children: ReactNode;
}

// interface com dados para alterar o contexto do carrinho
interface UpdateProductAmount {
  productId: number;
  amount: number;
}

// interface que irá manter o contexto (browser, dados e funcionalidades)
interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

// criando contexto vazio
const CartContext = createContext<CartContextData>({} as CartContextData);

// criando provider (CartProvider) será usado para encapsular no App
export function CartProvider({ children }: CartProviderProps): JSX.Element {

  // criando hook do carrinho
  const [cart, setCart] = useState<Product[]>(() => {

    // recuperando carrinho na storage - Andre - 21/09/2021
    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    
    // a storage armazena em texto convertendo para json
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });

  const prevCartRef = useRef<Product[]>();

  // roda a cada renderização (pois não tem dependencia)
  useEffect(()=> {
    prevCartRef.current = cart
  })

  // na primeira vez o prevCartRef.current vira vazio, o previus recebe o cart
  // nas proximas vezes o previus recebe o prevCartRef.current
  const cartPreviousValue = prevCartRef.current ?? cart

  // atualiza automaticamente a localStorage sempre que o cart mudar
  useEffect(()=> {
    if (cartPreviousValue !== cart) {
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(cart));
    }
  }, [cart, cartPreviousValue])

  // incluindo produto no carrinho, depois na storage - Andre - 21/09/2021
  const addProduct = async (productId: number) => {
    try {
      // recuperando itens do carrinho atual
      const updatedCart = cart.map((product) => ({ ...product}))

      // recuperando quantidae de produto no estoque
      const stock = await api.get(`/stock/${productId}`)
      
      // BoaPratica: Bloquear quantidade de produto no estoque

      //recuperando quantia no estoque do produto
      const stockAmount = stock.data.amount;

      // se não tem estoque retorna
      if ( stockAmount < 1) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      // apontando para o produto se já existir no carrinho atual 
      const productAlreadyExist = updatedCart.find((item) => item.id === productId)

      // se recuperou produto
      if (productAlreadyExist) {

        // recuperando quantidade do produto já no carrinho carrinho
        const currentAmount = productAlreadyExist ? productAlreadyExist.amount : 0;

        //Incrementa montante do item
        const amount = currentAmount + 1;

        //checar montante em relação ao estoque
        if (amount > stockAmount) {
          toast.error("Quantidade solicitada fora de estoque");
          return;
        }

        // atualiza montante no item existente
        productAlreadyExist.amount = amount;

      } else {

        // recupera dados do produto por id
        const product = await api.get(`/products/${productId}`);

        // cria objeto newProduct para ser inserido no carrinho
        // Incluindo nos dados oriundos da api o amount
        const newProduct = {
          ...product.data,
          amount: 1,
        };

        // atualiza carrinho com novo produto.
        updatedCart.push(newProduct);
      }

      // atualiza hook
      setCart(updatedCart);

     } catch {
      // Todo: Tratando error: "Product not exist/finished at Stock "
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {

      // clonando para deixar o cart integro
      const updatedCart = [...cart];

      // recuperando index do produto a ser removido
      const productIdx = updatedCart.findIndex(
        (product) => product.id === productId
      );

      // se encontrou 
      if (productIdx >= 0) {
        // remove produto 
        updatedCart.splice(productIdx, 1);
        // atualiza hook
        setCart(updatedCart);

      } else {
        // forçando ir para o catch 
        throw Error();
      }
    } catch {
      // Todo: Tratando error: "Product not encontrado no carrinho"
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId, 
    amount 
  }: UpdateProductAmount) => {
    try {

      // se for para alterar para 0, deve excluir.
      // Esta chegando aqui o amount desejado 
      // O tratamento de increment ou decrement eh feito na página (nos handles)
      if (amount < 1) {
        return;
      }

      //pegar item em estoque pelo id do produto
      const stock = await api.get(`/stock/${productId}`);

      //checar quantia no estoque
      const stockAmount = stock.data.amount;

      // verifica disponibilidade
      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      // clonando para deixar o cart integro
      const updatedCart = [...cart];

      // apontando para o produto do carrinho atual
      const productAlreadyExist = updatedCart.find((item) => item.id === productId);

      // se recuperou
      if (productAlreadyExist) {

        //altera a quantidade no produto ja existente
        productAlreadyExist.amount = amount;
        // atualiza hook
        setCart(updatedCart);
      } else {
        throw Error();
      }
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
