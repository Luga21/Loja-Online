let modalKey = 0

let quantProdutos = 1

let cart = [] // carrinho

// funcoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.productWindowArea').style.opacity = 0 // transparente
    seleciona('.productWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.productWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.productWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.productWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.productInfo--cancelButton, .productInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDosProdutos = (productItem, item, index) => {
    // setar um atributo para identificar qual elemento foi clicado
	productItem.setAttribute('data-key', index)
    productItem.querySelector('.product-item--img img').src = item.img
    productItem.querySelector('.product-item--price').innerHTML = formatoReal(item.price[2])
    productItem.querySelector('.product-item--name').innerHTML = item.name
    productItem.querySelector('.product-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.productBig img').src = item.img
    seleciona('.productInfo h1').innerHTML = item.name
    seleciona('.productInfo--desc').innerHTML = item.description
    seleciona('.productInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a class que passamos
    // do .product-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.product-item').getAttribute('data-key')
    console.log('Produto clicado ' + key)
    console.log(productJson[key])

    // garante que a quantidade inicial de produtos é 1
    quantProdutos = 1

    // mantem a informação de qual produto foi clicado
    modalKey = key

    return key
}

const preencherEstado = (key) => {
    seleciona('.productInfo--size.selected').classList.remove('selected')

    selecionaTodos('.productInfo--size').forEach((size, sizeIndex) => {
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = productJson[key].sizes[sizeIndex]
    })
}

const escolherEstadoPreco = (key) => {
    selecionaTodos('.productInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            seleciona('.productInfo--size.selected').classList.remove('selected')
            size.classList.add('selected')

            seleciona('.productInfo--actualPrice').innerHTML = formatoReal(productJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    seleciona('.productInfo--qtmais').addEventListener('click', () => {
        quantProdutos++
        seleciona('.productInfo--qt').innerHTML = quantProdutos
    })

    seleciona('.productInfo--qtmenos').addEventListener('click', () => {
        if(quantProdutos > 1) {
            quantProdutos--
            seleciona('.productInfo--qt').innerHTML = quantProdutos	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.productInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

    	console.log("product " + modalKey)
    	
	    let size = seleciona('.productInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
    	console.log("Quant. " + quantProdutos)
        let price = seleciona('.productInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
	    let identificador = productJson[modalKey].id+'t'+size

        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            cart[key].qt += quantProdutos
        } else {
            let product = {
                identificador,
                id: productJson[modalKey].id,
                size, // size: size
                qt: quantProdutos,
                price: parseFloat(price) // price: price
            }
            cart.push(product)
            console.log(product)
            console.log('Sub total R$ ' + (product.qt * product.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

		let subtotal = 0
		let desconto = 0
		let total    = 0

        // preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			let productItem = productJson.find( (item) => item.id == cart[i].id )
			console.log(productItem)

        	subtotal += cart[i].price * cart[i].qt

			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let productSizeName = cart[i].size

			let productName = `${productItem.name} (${productSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = productItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = productName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		// fora do for
		desconto = subtotal * 0
		total = subtotal - desconto

		
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}



// MAPEAR productJson para gerar lista de produtos
productJson.map((item, index ) => {
    let productItem = document.querySelector('.models .product-item').cloneNode(true)
    seleciona('.product-area').append(productItem)

    preencheDadosDosProdutos(productItem, item, index)
    
    productItem.querySelector('.product-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou no produto')

        let chave = pegarKey(e)

        abrirModal()

        preencheDadosModal(item)

        preencherEstado(chave)

		seleciona('.productInfo--qt').innerHTML = quantProdutos

        escolherEstadoPreco(chave)

    })

    botoesFechar()

}) // fim do MAPEAR productJson para gerar lista de produtos

mudarQuantidade()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()