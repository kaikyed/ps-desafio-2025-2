'use client'

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import FormFieldsCategory from './form-fields-category'
import { updatePropertyCategory } from '@/actions/property-category'
import { filterFormData } from '@/services/filter-form-data'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/use-toast'
// CORREÇÃO: Importando do arquivo correto
import { propertyCategoryType } from '@/types/property-category'
import { ResponseErrorType, api } from '@/services/api'

interface DialogUpdateCategoryProps {
  id: string
  children: React.ReactNode
}

export function DialogUpdateCategory({
  id,
  children,
}: DialogUpdateCategoryProps) {
  const [category, setCategory] = useState<propertyCategoryType | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [error, setError] = useState<ResponseErrorType | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      const requestData = async () => {
        const { response } = await api<propertyCategoryType>('GET', `/property-categories/${id}`)

        if (response) {
          setCategory(response)
        } else {
          setCategory(null)
          toast({
            title: 'Categoria não encontrada!',
            variant: 'destructive'
          })
          setOpen(false)
        }
      }
      requestData()
    }

    return () => {
      if (!open) {
        setCategory(null)
        setError(null)
      }
    }
  }, [id, open, toast])

  const submit = async (form: FormData) => {
    const newForm = await filterFormData(form)

    const res = await updatePropertyCategory(newForm)
    const { error } = res as any 

    if (error) {
      setError(error)
      toast({
        title: 'Não foi possível editar a categoria!',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Categoria editada com sucesso!',
      })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar categoria</DialogTitle>
          <DialogDescription>
            Atualize as informações da categoria abaixo e clique em
            &quot;Salvar&quot; para aplicar as alterações.
          </DialogDescription>
        </DialogHeader>
        {category ? (
            <form action={submit}>
            <FormFieldsCategory error={error} category={category} />
            </form>
        ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">Carregando dados...</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
