'use client'

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import FormFieldsProperty from './form-fields-property'
import { updateProperty } from '@/actions/property'
import { filterFormData } from '@/services/filter-form-data'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/use-toast'
import { PropertyType } from '@/types/property'
import { ResponseErrorType, api } from '@/services/api'

interface DialogUpdatePropertyProps {
  id: string
  children: React.ReactNode
}

export function DialogUpdateProperty({ id, children }: DialogUpdatePropertyProps) {
  const [property, setProperty] = useState<PropertyType | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [error, setError] = useState<ResponseErrorType | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
        const requestData = async () => {
        const { response } = await api<PropertyType>('GET', `/properties/${id}`)

        if (response) {
            setProperty(response)
        } else {
            setProperty(null)
            toast({
            title: 'Imóvel não encontrado!',
            variant: 'destructive'
            })
            setOpen(false)
        }
        }
        requestData()
    }

    return () => {
      if(!open) {
        setProperty(null)
        setError(null)
      }
    }
  }, [id, open, toast])

  const submit = async (form: FormData) => {
    const newForm = await filterFormData(form)

    const res = await updateProperty(newForm)
    const { error } = res as any

    if (error) {
      setError(error)
      toast({
        title: 'Não foi possível editar o imóvel!',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Imóvel editado com sucesso!',
      })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar imóvel</DialogTitle>
          <DialogDescription>
            Atualize as informações do imóvel abaixo e clique em
            &quot;Salvar&quot; para aplicar as alterações.
          </DialogDescription>
        </DialogHeader>
        {property ? (
            <form action={submit}>
            <FormFieldsProperty error={error} property={property} />
            </form>
        ) : (
             <div className="p-4 text-center text-sm text-muted-foreground">Carregando dados...</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
