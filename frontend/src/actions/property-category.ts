'use server'

import { api } from '@/services/api'
import { revalidatePath } from 'next/cache'
import { json } from 'stream/consumers'

export async function createPropertyCategory(form: FormData) {

    const res = await api('POST', '/property-categories', {data: form})

    if(!res.error){

        revalidatePath('/admin/categories')

    }

    return JSON.stringify(res)

}

export async function updatePropertyCategory(form: FormData) {

    const res = await api('POST', `/property-categories/${form.get('id')}`, {data: form})

    if(!res.error){

        revalidatePath('/admin/categories')

    }


}

export async function destroyPropertyCategory(id: string) {


    const res = await api('DELETE', `/property-categories/${id}`)

    if(!res.error){

        revalidatePath('/admin/categories')

    }
    
}
