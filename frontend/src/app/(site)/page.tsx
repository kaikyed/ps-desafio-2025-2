'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import './landing.css'

// 1. IMPORTAÇÃO DAS FONTES
import { Comfortaa } from 'next/font/google'
import localFont from 'next/font/local'

// CONFIGURAÇÃO DAS FONTES
const comfortaa = Comfortaa({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-comfortaa',
  display: 'swap',
})

const momoTrust = localFont({
  src: './fontemomo.ttf', 
  variable: '--font-momo',
  display: 'swap',
})

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// --- TIPAGEM ---
type Imovel = {
  id: string
  name: string
  description: string
  price: number
  image: string
  type: string
  acquired?: boolean // <--- CAMPO DE STATUS (Vendido/Adquirido)
  property_category?: {
    name: string
  }
}

// Tipo para Categoria
type Category = {
  id: string
  name: string
}

const PriceDisplay = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const elementRef = useRef<HTMLParagraphElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const duration = 1500
          const increment = value / (duration / 16)

          const timer = setInterval(() => {
            start += increment
            if (start >= value) {
              setDisplayValue(value)
              clearInterval(timer)
            } else {
              setDisplayValue(Math.floor(start))
            }
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [value])

  return (
    <p className="preco" ref={elementRef}>
      {displayValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    </p>
  )
}

export default function LandingPage() {
  // --- ESTADOS ---
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  
  // Estado para categorias
  const [categories, setCategories] = useState<Category[]>([]) 
  
  const [loading, setLoading] = useState(true)
  const [filterTipo, setFilterTipo] = useState('todos')
  const [filterPreco, setFilterPreco] = useState('todos')
  const [darkMode, setDarkMode] = useState(false)
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null)
  const [contactVisible, setContactVisible] = useState(false)
  const contactRef = useRef<HTMLElement>(null)

  // --- FETCH DADOS (IMÓVEIS) ---
  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        const response = await fetch(`${API_URL}/properties`)
        const data = await response.json()
        const lista = Array.isArray(data) ? data : data.data || []
        setImoveis(lista)
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchImoveis()
  }, [])

  // --- FETCH DADOS (CATEGORIAS) ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/property-categories`) 
        const data = await response.json()
        const listaCategorias = Array.isArray(data) ? data : data.response || data.data || []
        setCategories(listaCategorias)
      } catch (error) {
        console.error("Erro ao buscar categorias:", error)
      }
    }
    fetchCategories()
  }, [])

  // Dark Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.body.classList.add('dark-mode')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }

  // Animação Contato
  useEffect(() => {
    const element = contactRef.current
    if(!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setContactVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // --- FILTROS ---
  const filteredImoveis = useMemo(() => {
    return imoveis.filter((imovel) => {
      const tipoImovel = imovel.property_category?.name?.toLowerCase() || ''
      const matchTipo = filterTipo === 'todos' || tipoImovel === filterTipo
      
      const preco = Number(imovel.price)
      let matchPreco = true
      if (filterPreco === 'ate-400') matchPreco = preco <= 400000
      if (filterPreco === '400-800') matchPreco = preco > 400000 && preco <= 800000
      if (filterPreco === 'acima-800') matchPreco = preco > 800000
      
      return matchTipo && matchPreco
    })
  }, [filterTipo, filterPreco, imoveis])

  const clearFilters = () => {
    setFilterTipo('todos')
    setFilterPreco('todos')
  }

  return (
    <div className={`landing-container ${comfortaa.variable} ${momoTrust.variable}`}>
      
      <header className="header">
        <div className="logo-titulo">
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToTop() }} className="link-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo" src="/logo_site.png" alt="Logo Dream House" />
          </a>
          <div className="titulos-container">
            <h1 className="site-title">Dream House</h1>
            <p className="site-sub-title">Venda de imóveis</p>
          </div>
        </div>
        <nav className="nav-header">
          <button type="button" className="btn-nav" onClick={scrollToTop}>Início</button>
          <button type="button" className="btn-nav" onClick={() => scrollToSection('imoveis')}>Imóveis</button>
          <button type="button" className="btn-nav" onClick={() => scrollToSection('contato')}>Contato</button>
          
          {/* Link Admin Corrigido para /admin */}
          <a 
            href="/admin" 
            className="btn-nav" 
            style={{backgroundColor: '#333'}}
            target="_blank" 
            rel="noopener noreferrer"
          >
            Área Admin
          </a>
        </nav>
      </header>

      <main className="container-principal" id="inicio">
        
        <section className="hero" id="imoveis">
          <h2>Encontre o imóvel dos seus sonhos!</h2>
          <p>Os melhores imóveis com os melhores preços da região.</p>
        </section>

        <section className="filtros-section">
          <h3>Encontre o imóvel perfeito para você</h3>
          <div className="filtros-container">
            
            <div className="filtro-grupo">
              <label>Tipo de imóvel</label>
              <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
                <option value="todos">Todos os tipos</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name.toLowerCase()}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-grupo">
              <label>Faixa de preço</label>
              <select value={filterPreco} onChange={(e) => setFilterPreco(e.target.value)}>
                <option value="todos">Todos os preços</option>
                <option value="ate-400">Até R$ 400.000</option>
                <option value="400-800">R$ 400.000 – R$ 800.000</option>
                <option value="acima-800">Acima de R$ 800.000</option>
              </select>
            </div>
            <button onClick={clearFilters} className="btn-limpar">Limpar filtros</button>
          </div>
        </section>

        <section className="grid-imoveis">
          {loading ? (
             <p style={{width: '100%', textAlign: 'center', fontSize: '1.2rem'}}>Carregando imóveis...</p>
          ) : (
            <>
              {filteredImoveis.map((imovel, index) => {
                // --- LÓGICA DE VENDIDO (ADQUIRIDO) ---
                const vendido = imovel.acquired === true; // Verifica se está vendido

                return (
                  <article 
                    key={imovel.id} 
                    // Se vendido, adiciona classe CSS especial
                    className={`card-imovel ${vendido ? 'indisponivel' : ''}`}
                    style={{ animation: `fadeIn 0.6s ease forwards ${index * 0.1}s` }}
                    onClick={() => {
                      // Se vendido, NÃO abre o modal
                      if (!vendido) setSelectedImovel(imovel)
                    }}
                  >
                    {/* Container da Imagem */}
                    <div className="card-image-container">
                      
                      {/* Selo Visual de Vendido */}
                      {vendido && (
                        <span className="tag-acquired">Vendido</span>
                      )}
                      
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={imovel.image || 'https://via.placeholder.com/600x450/5D33E0/white?text=Sem+Imagem'} 
                        alt={imovel.name} 
                        loading="lazy"
                        // Imagem Preto e Branco se vendido
                        style={vendido ? { filter: 'grayscale(100%)' } : {}}
                      />
                    </div>
                    {/* Fim do Container da Imagem */}
                    
                    <div className="card-info">
                      {/* Tag Cinza se vendido */}
                      <span className="tag-tipo" style={vendido ? { background: '#999' } : {}}>
                        {/* LÓGICA ATUALIZADA: Combina Type + Categoria */}
                        {imovel.type && imovel.property_category?.name
                            ? `${imovel.type} | ${imovel.property_category.name}` // Ex: Casa | Residencial
                            : imovel.type || imovel.property_category?.name || 'Imóvel'}
                      </span>
                      <h3>{imovel.name}</h3>
                      
                      {/* Preço Riscado se vendido */}
                      {vendido ? (
                         <p className="preco" style={{color: '#777', textDecoration: 'line-through'}}>
                           {Number(imovel.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                         </p>
                      ) : (
                         <PriceDisplay value={Number(imovel.price)} />
                      )}
                    </div>
                  </article>
                )
              })}
              {!loading && filteredImoveis.length === 0 && (
                <p style={{width: '100%', textAlign: 'center'}}>Nenhum imóvel encontrado com esses filtros.</p>
              )}
            </>
          )}
        </section>

        <section ref={contactRef} className={`contato-section ${contactVisible ? 'aparecer' : ''}`} id="contato">
           <h2 className="contato-titulo">Fale Conosco</h2>
           <p className="contato-subtitulo">Preencha o formulário abaixo e um de nossos corretores entrará em contato em até 24h.</p>
           <div className="contato-container">
             <form 
                className="contato-form" 
                action="https://formspree.io/f/SEU_ID_AQUI" 
                method="POST"
             >
               <div className="form-group"><input type="text" name="nome" placeholder="Seu nome" required /></div>
               <div className="form-group"><input type="email" name="_replyto" placeholder="Seu e-mail" required /></div>
               <div className="form-group"><input type="tel" name="telefone" placeholder="Seu telefone / WhatsApp" /></div>
               <div className="form-group"><textarea name="mensagem" rows={5} placeholder="Em que podemos ajudar?" required></textarea></div>
               <button type="submit" className="btn-enviar">Enviar Mensagem</button>
             </form>
             <div className="contato-info">
               <div className="info-item"><h4>Telefone / WhatsApp</h4><p>(27) 99981-7144</p></div>
               <div className="info-item"><h4>E-mail</h4><p>contato@dreamhouse.com.br</p></div>
               <div className="info-item"><h4>Endereço</h4><p>Rua dos Sonhos, 123<br />Jardim dos Imóveis - São Mateus/ES</p></div>
             </div>
           </div>
        </section>
      </main>

      {selectedImovel && (
        <div className="modal" style={{ display: 'flex' }} onClick={(e) => {
           if ((e.target as HTMLElement).className === 'modal') setSelectedImovel(null)
        }}>
          <div className="modal-conteudo">
            <span className="fechar-modal" onClick={() => setSelectedImovel(null)}>×</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id="modal-img" src={selectedImovel.image} alt={selectedImovel.name} />
            <div className="modal-info">
              <h2>{selectedImovel.name}</h2>
              <p className="preco">
                {Number(selectedImovel.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p style={{marginBottom: '15px', color: '#666', lineHeight: '1.4'}}>
                 {selectedImovel.description}
              </p>
              <p style={{fontWeight: 'bold', color: '#5D33E0'}}>Interessado? Chame no WhatsApp!</p>
            </div>
          </div>
        </div>
      )}

      <button id="toggle-dark-mode" className="dark-mode-btn" onClick={toggleDarkMode}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/darkmode-icon.png" alt="Tema" />
      </button>

      <a href="https://wa.me/5527999817144" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
      </a>
    </div>
  )
}