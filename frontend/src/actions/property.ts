'use server'

import { api } from '@/services/api'
import { revalidatePath } from 'next/cache'

/**
 * Criação de Imóvel
 */
export async function createProperty(form: FormData) {
    // 1. TRATAMENTO DE PREÇO (R$ 1.200,50 -> 1200.50)
    const rawPrice = form.get('price')?.toString()
    if (rawPrice) {
        const fixedPrice = rawPrice.replace(/\./g, '').replace(',', '.')
        form.set('price', fixedPrice)
    }

    console.log("========== [CRIAR IMÓVEL] ==========")
    console.log("Nome:", form.get('name'))
    console.log("Preço Final:", form.get('price'))
    console.log("Categoria:", form.get('property_category_id'))
    
    const img = form.get('image')
    if (img instanceof File) {
        console.log(`Imagem: ${img.name} (${img.size} bytes)`)
    } else {
        console.log("Imagem: NÃO ENVIADA ou INVÁLIDA")
    }

    // CORREÇÃO: Adicionado <any> para evitar erro de tipagem no retorno
    const res = await api<any>('POST', '/properties', { data: form })

    if (res.error) {
        console.error("❌ ERRO API:", JSON.stringify(res.error, null, 2))
    } else {
        // Agora o TS aceita acessar .id porque definimos o retorno como any
        console.log("✅ SUCESSO! ID:", res.response?.id)
        revalidatePath('/admin/imoveis')
        revalidatePath('/') 
    }

    return JSON.parse(JSON.stringify(res))
}

/**
 * Atualização de Imóvel
 */
export async function updateProperty(form: FormData) {
    const id = form.get('id')

    form.append('_method', 'PUT')

    const rawPrice = form.get('price')?.toString()
    if (rawPrice) {
        const fixedPrice = rawPrice.replace(/\./g, '').replace(',', '.')
        form.set('price', fixedPrice)
    }

    console.log(`========== [ATUALIZAR IMÓVEL ${id}] ==========`)

    // Adicionado <any> aqui também por garantia
    const res = await api<any>('POST', `/properties/${id}`, { data: form })

    if (res.error) {
        console.error("❌ ERRO UPDATE:", JSON.stringify(res.error, null, 2))
    } else {
        console.log("✅ UPDATE SUCESSO")
        revalidatePath('/admin/imoveis')
        revalidatePath('/')
    }

    return JSON.parse(JSON.stringify(res))
}

/**
 * Exclusão de Imóvel
 */
export async function destroyProperty(id: string) {
    console.log(`========== [DELETAR IMÓVEL ${id}] ==========`)
    
    const res = await api<any>('DELETE', `/properties/${id}`)

    if (res.error) {
        console.error("❌ ERRO DELETE:", JSON.stringify(res.error, null, 2))
    } else {
        console.log("✅ DELETE SUCESSO")
        revalidatePath('/admin/imoveis')
        revalidatePath('/')
    }

    return JSON.parse(JSON.stringify(res))
}