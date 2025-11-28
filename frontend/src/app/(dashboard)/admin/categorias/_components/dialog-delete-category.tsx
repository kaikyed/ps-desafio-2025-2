'use client'

import { destroyPropertyCategory } from '@/actions/property-category' // Nome corrigido
import { Button } from '@/components/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from '@/components/dialog'
import { useToast } from '@/components/use-toast'
import { useState } from 'react'

interface DialogDeleteCategoryProps {
  id: string
  children: React.ReactNode
}

export function DialogCategoryDelete({
  id,
  children,
}: DialogDeleteCategoryProps) {
  const [open, setOpen] = useState<boolean>(false)
  const { toast } = useToast()

  const submit = async () => {
    // Ajuste conforme o retorno da sua Server Action
    const res = await destroyPropertyCategory(id)
    const { error } = res as any 

    if (error) {
      toast({
        title: 'Não foi possível excluir a categoria!',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Categoria deletada com sucesso!',
      })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão de categoria</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir esta categoria? Esta ação é
            irreversível e removerá permanentemente a categoria do sistema.
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" type="submit">
              Excluir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
