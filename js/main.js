const form = document.getElementById('novoItem')
const itens = JSON.parse(localStorage.getItem('itens')) || []

itens.forEach(element => {
    criaElemento(element)
});

form.addEventListener("submit", (evento) => {
    evento.preventDefault()

    const nome = evento.target.elements['nome']
    const quantidade = evento.target.elements['quantidade']

    const itemAtual = {
        "nome": nome.value,
        "quantidade": quantidade.value
    }

    const existe = itens.find(element => nome.value === element.nome)
    if (existe){
        itemAtual.id = existe.id
        atualizaElemento(itemAtual)

        itens[existe.id] = itemAtual
        itens[itens.findIndex ((element) => element.id === existe.id)] = itemAtual
    }else{
        itemAtual.id = itens[itens.length -1] ? itens[itens.length - 1].id + 1 : 0
        criaElemento(itemAtual)
        itens.push(itemAtual)
    }

    localStorage.setItem("itens", JSON.stringify(itens) )
    nome.value = ""
    quantidade.value = ""
})

function criaElemento (item){

    const novoItem = document.createElement('li')
    novoItem.classList.add('item')

    const numeroItem = document.createElement('strong')
    numeroItem.innerHTML = item.quantidade
    numeroItem.dataset.id = item.id

    novoItem.appendChild(numeroItem)
    novoItem.innerHTML += item.nome

    novoItem.appendChild(botaoDeleta(item.id))

    const lista = document.getElementById('lista')
    lista.appendChild(novoItem)

}

function atualizaElemento(item){
    document.querySelector("[data-id='"+ item.id+"']").innerHTML = item.quantidade
}

function botaoDeleta(id){
    const elementoBotao = document.createElement('button')
    elementoBotao.innerText = "X"

    elementoBotao.addEventListener("click", (evento) => {
        deletaElemento(evento.target.parentNode, id)
    })

    return elementoBotao
}

function deletaElemento(elemento, id){
    elemento.remove()
    itens.splice(itens.findIndex(element => element.id === id), 1)
    localStorage.setItem("itens", JSON.stringify(itens) )
}

function requerindoDados(){
    const cidade = document.getElementById('lugar').value

    const URL = `http://localhost:3000/api/external?cidade=${cidade}`;

    fetch(URL)
        .then(response => {
            if (response.status === 500){
                return new Error('Cidade inválida!')
            }
            return response.json()
        })
        .then(data => {alterandoDados(tratandoDadosClima(data))})

        .catch(error => {
            exibirMensagemErro()
        });

        cidade.innerHTML = ''
}

const enviar = document.getElementById('enviar')
enviar.addEventListener("click", function(){
    requerindoDados()
})

function tratandoDadosClima(dadosGeraisClima){
    const dadosEspecificosClima = dadosGeraisClima.main
    const pais = dadosGeraisClima.sys.country + ", " + dadosGeraisClima.name

    const sensacaoTermicaCelsius = converterParaCelcius(dadosEspecificosClima.feels_like)
    const temperaturaCelsius = converterParaCelcius(dadosEspecificosClima.temp)
    const tempMaxCelsius = converterParaCelcius(dadosEspecificosClima.temp_max)
    const tempMinCelsius = converterParaCelcius(dadosEspecificosClima.temp_min)

    return objDadosClima = {
        pais: pais,
        sensencao_termica: sensacaoTermicaCelsius,
        temperatura: temperaturaCelsius,
        temp_max: tempMaxCelsius,
        temp_min: tempMinCelsius
    }

}

function converterParaCelcius(temperatura){
    const temp = temperatura
    return temp - 273.15
}

function alterandoDados(objDadosClima) {

    if(objDadosClima.temperatura > 30){
        const caixaDicas = document.getElementById('destino')
        caixaDicas.style.display = 'flex'
        caixaDicas.style.backgroundColor = '#FDA400'

        const tempNumero = document.getElementById('temperatura-numero')
        tempNumero.innerHTML = `${parseInt(objDadosClima.temperatura)}º`
        tempNumero.style.display = 'flex'
        tempNumero.style.color = '#BB560E'

        const local = document.getElementById('local')
        local.innerHTML = objDadosClima.pais
        local.style.display = 'flex'
        local.style.color = '#864909'

        const sensacaoTermica = document.getElementById('sensacao-termica')
        sensacaoTermica.innerHTML = `Sensação: ${parseInt(objDadosClima.sensencao_termica)}º`
        sensacaoTermica.style.display = 'flex'
        sensacaoTermica.style.color = '#282828'

        const minMax = document.getElementById('min-max')
        minMax.innerHTML = `${parseInt(objDadosClima.temp_max)}º / ${parseInt(objDadosClima.temp_min)}º`
        minMax.style.display = 'flex'
        minMax.style.color = '#282828'

        const estacao = document.getElementById('estacao')
        estacao.innerHTML = 'Calor'
        estacao.style.display = 'flex'
        estacao.style.color = '#BB560E'

        const textoDica = document.getElementById('texto-dica')
        textoDica.innerHTML = 'Utilizar roupas que cubram menos o corpo, considerando o calor que está fazendo.'
        textoDica.style.display = 'flex'
        textoDica.style.color = '#282828'

        const img = document.getElementById('img')
        img.setAttribute("src", "./img/sunicon.png")
        img.style.display = 'flex'

    }else{

        const caixaDicas = document.getElementById('destino')
        caixaDicas.style.display = 'flex'
        caixaDicas.style.backgroundColor = '#282828'

        const tempNumero = document.getElementById('temperatura-numero')
        tempNumero.innerHTML = `${parseInt(objDadosClima.temperatura)}º`
        tempNumero.style.display = 'flex'
        tempNumero.style.color = '#006c6c'

        const local = document.getElementById('local')
        local.innerHTML = objDadosClima.pais
        local.style.display = 'flex'
        local.style.color = '#4d6e6e'

        const sensacaoTermica = document.getElementById('sensacao-termica')
        sensacaoTermica.innerHTML = `Sensação: ${parseInt(objDadosClima.sensencao_termica)}º`
        sensacaoTermica.style.display = 'flex'
        sensacaoTermica.style.color = '#838383'

        const minMax = document.getElementById('min-max')
        minMax.innerHTML = `${parseInt(objDadosClima.temp_max)}º / ${parseInt(objDadosClima.temp_min)}º`
        minMax.style.display = 'flex'
        minMax.style.color = '#838383'

        const estacao = document.getElementById('estacao')
        estacao.innerHTML = 'Frio'
        estacao.style.display = 'flex'
        estacao.style.color = '#006c6c'

        const textoDica = document.getElementById('texto-dica')
        textoDica.innerHTML = 'Utilizar roupas que cubram mais o corpo, considerando o frio que está fazendo.'
        textoDica.style.display = 'flex'
        textoDica.style.color = '#838383'

        const img = document.getElementById('img')
        img.setAttribute("src", "./img/coldicon.png")
        img.style.display = 'flex'
    }
}

function exibirMensagemErro(){
        const caixaDicas = document.getElementById('destino')
        caixaDicas.style.display = 'flex'
        caixaDicas.style.backgroundColor = '#282828'

        const tempNumero = document.getElementById('temperatura-numero')
        tempNumero.innerHTML = 'Essa cidade não existe'
        tempNumero.style.color = '#006c6c'

        document.getElementById('local').style.display = 'none'
        document.getElementById('sensacao-termica').style.display = 'none'
        document.getElementById('min-max').style.display = 'none'
        document.getElementById('estacao').style.display = 'none'
        document.getElementById('texto-dica').style.display = 'none'
        document.getElementById('img').style.display = 'none'
        
}