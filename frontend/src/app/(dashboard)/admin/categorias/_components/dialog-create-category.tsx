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
// CORREÇÃO: Importando a action correta
import { createPropertyCategory } from '@/actions/property-category'
import { filterFormData } from '@/services/filter-form-data'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/use-toast'
import { ResponseErrorType } from '@/services/api'

interface DialogCreateCategoryProps {
  children: React.ReactNode
}

export function DialogCreateCategory({ children }: DialogCreateCategoryProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [error, setError] = useState<ResponseErrorType | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!open) {
      setError(null)
    }
  }, [open])

  const submit = async (form: FormData) => {
    const newForm = await filterFormData(form)

    // Chama a Server Action
    const res = await createPropertyCategory(newForm)
    
    // Extrai o erro (type casting para garantir flexibilidade caso a action mude)
    const { error } = res as any 

    if (error) {
      setError(error)
      toast({
        title: 'Não foi possível criar a categoria!',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Categoria criada com sucesso!',
      })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar categoria</DialogTitle>
          <DialogDescription>
            Preencha as informações da nova categoria abaixo e clique em
            &rdquo;Salvar&rdquo; para incluí-la no sistema.
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          {/* Passamos o erro para o formulário exibir nos campos se necessário */}
          <FormFieldsCategory error={error} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
