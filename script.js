const { createApp } = Vue;

createApp({
  data() {
    return {
      darkMode: true,
      mensagemSubtotal: '',
      mensagemRefrigerante: '',
      historico: [],

      produtos: [
        { id: 1, nome: 'X-Burguer',         emoji: '🍔', preco: 18.90, quantidade: 0, categoria: 'lanche' },
        { id: 2, nome: 'X-Bacon',            emoji: '🥓', preco: 22.90, quantidade: 0, categoria: 'lanche' },
        { id: 3, nome: 'X-Frango',           emoji: '🍗', preco: 19.90, quantidade: 0, categoria: 'lanche' },
        { id: 4, nome: 'X-Veggie',           emoji: '🥬', preco: 17.90, quantidade: 0, categoria: 'lanche' },
        { id: 5, nome: 'Batata Frita P',     emoji: '🍟', preco:  8.90, quantidade: 0, categoria: 'acompanhamento' },
        { id: 6, nome: 'Batata Frita G',     emoji: '🍟', preco: 13.90, quantidade: 0, categoria: 'acompanhamento' },
        { id: 7, nome: 'Onion Rings',        emoji: '🧅', preco: 11.90, quantidade: 0, categoria: 'acompanhamento' },
        { id: 8, nome: 'Nuggets (10 un)',    emoji: '🍗', preco: 14.90, quantidade: 0, categoria: 'acompanhamento' },
        { id: 9, nome: 'Refrigerante Lata',  emoji: '🥤', preco:  5.90, quantidade: 0, categoria: 'bebida' },
        { id: 10, nome: 'Suco Natural',      emoji: '🍊', preco:  8.90, quantidade: 0, categoria: 'bebida' },
        { id: 11, nome: 'Água Mineral',      emoji: '💧', preco:  3.50, quantidade: 0, categoria: 'bebida' },
        { id: 12, nome: 'Milk-shake',        emoji: '🥛', preco: 14.90, quantidade: 0, categoria: 'bebida' },
        { id: 13, nome: 'Sorvete Copa',      emoji: '🍨', preco:  9.90, quantidade: 0, categoria: 'sobremesa' },
        { id: 14, nome: 'Brownie',           emoji: '🍫', preco:  7.90, quantidade: 0, categoria: 'sobremesa' },
      ],
    };
  },

  computed: {
    /* ── itens com quantidade > 0 ── */
    itensPedido() {
      return this.produtos.filter(p => p.quantidade > 0);
    },

    /* ── total de unidades no pedido ── */
    totalItens() {
      return this.produtos.reduce((acc, p) => acc + Number(p.quantidade), 0);
    },

    /* ── subtotal bruto ── */
    subtotal() {
      return this.produtos.reduce(
        (acc, p) => acc + Number(p.quantidade) * p.preco, 0
      );
    },

    /* ── taxa de entrega: grátis acima de R$80, senão R$6,90 ── */
    taxaEntrega() {
      if (this.subtotal === 0) return 0;
      return this.subtotal >= 80 ? 0 : 6.90;
    },

    /* ── desconto: 10% quando subtotal > R$100 ── */
    desconto() {
      return this.subtotal > 100 ? this.subtotal * 0.10 : 0;
    },

    /* ── total final ── */
    total() {
      return this.subtotal + this.taxaEntrega - this.desconto;
    },

    /* ── quantidade total de refrigerantes ── */
    qtdRefrigerante() {
      const refri = this.produtos.find(p => p.id === 9);
      return refri ? Number(refri.quantidade) : 0;
    },

    pedidoVazio() {
      return this.totalItens === 0;
    },
  },

  watch: {
    /* ── watch: subtotal ── */
    subtotal(novoValor, valorAnterior) {
      console.log(
        `[Pedido] Subtotal atualizado: R$ ${valorAnterior.toFixed(2)} → R$ ${novoValor.toFixed(2)}`
      );

      if (novoValor > 100 && valorAnterior <= 100) {
        this.mensagemSubtotal = '🎉 Parabéns! Você ganhou 10% de desconto no pedido!';
      } else if (novoValor <= 100 && valorAnterior > 100) {
        this.mensagemSubtotal = '';
      }
    },

    /* ── watch: quantidade de refrigerantes ── */
    qtdRefrigerante(novoValor) {
      if (novoValor > 5) {
        this.mensagemRefrigerante = '⚠️ Muitos refrigerantes! Que tal experimentar um suco?';
      } else {
        this.mensagemRefrigerante = '';
      }
    },

    /* ── watch: pedido completo (deep) ── */
    itensPedido: {
      deep: true,
      handler(itens) {
        const snapshot = itens.map(p => `${p.nome} x${p.quantidade}`).join(', ');
        console.log('[Pedido] Pedido atualizado:', snapshot || '(vazio)');
      },
    },
  },

  methods: {
    incrementar(produto) {
      produto.quantidade = Number(produto.quantidade) + 1;
    },

    decrementar(produto) {
      if (produto.quantidade > 0) {
        produto.quantidade = Number(produto.quantidade) - 1;
      }
    },

    limparPedido() {
      this.produtos.forEach(p => (p.quantidade = 0));
      this.mensagemSubtotal = '';
      this.mensagemRefrigerante = '';
      console.log('[Pedido] Pedido limpo.');
    },

    formatarPreco(valor) {
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    categoriaNome(cat) {
      const map = {
        lanche: '🍔 Lanches',
        acompanhamento: '🍟 Acompanhamentos',
        bebida: '🥤 Bebidas',
        sobremesa: '🍨 Sobremesas',
      };
      return map[cat] || cat;
    },

    categorias() {
      return [...new Set(this.produtos.map(p => p.categoria))];
    },

    produtosPorCategoria(cat) {
      return this.produtos.filter(p => p.categoria === cat);
    },
  },
}).mount('#app');
